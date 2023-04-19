import {
  ComprehendClient,
  BatchDetectKeyPhrasesCommand,
} from '@aws-sdk/client-comprehend'
import { Message } from '../models/messages.js'
import { WordKey } from '../models/mode.wordkeys.js'
import { User } from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cron from 'node-cron'
import * as dotenv from 'dotenv'
const API_URL = 'https://api.openai.com/v1/chat/completions'
dotenv.config()

const keyPhrase = process.env.JWT_SECRET_KEY

// Cron job
cron.schedule('*/10 * * * *', () => {
  console.log('Se ejecuta el CRON')
  processMessages()
  ManageTokenUser()
})

const ManageTokenUser = async () => {
  const users = await User.find()
  users.forEach((user) => {
    const removedTokens = user.tokens
    user.tokens = 0
    user.accumulated_tokens += removedTokens
    user.save()
    console.log('Se resetean los tokens de los users')
  })
}

//Login
export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' })
      return
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' })
      return
    }

    jwt.sign({ id: user._id }, keyPhrase, { expiresIn: '1d' }, (err, token) => {
      res.json({ token, name: user.name, email: user.email, id: user._id })
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

//Middleware verify tokens
export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    next()
  } else {
    res.status(403)
  }
}

export const verifyAdmin = (req, res, next) => {
  const { claveSecreta } = req.body

  if (typeof claveSecreta !== 'undefined') {
    req.claveSecreta = claveSecreta
    next()
  } else {
    res.status(403)
  }
}

export const verifyDailyLimit = async (req, res, next) => {
  const { userId } = req.body

  const user = await User.findOne({ _id: userId })
  const userTokens = user.tokens

  if (userTokens <= 2500) {
    next()
  } else {
    res.status(429).end()
  }
}

// Config de AWS Comprehend

const comprehend = new ComprehendClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
})

// Api para el chat del frontend
export const postMessage = async (req, res) => {
  //Funcion que usa a OpenAI solo si el token del usuario es valido
  const getMessage = async (req, res) => {
    //Guardar mensaje del usuario
    const messageToSave = await Message({ message: req.body.message.content })
    messageToSave.save()

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          ...req.body.allMessages,
          { role: 'user', content: `${req.body.message.content}` },
        ],
        stream: true,
        temperature: 0.1,
        stop: ['\ninfo:'],
      }),
    })

    if (!response.ok) {
      console.error(response.statusText)
      return res.status(500).json({ error: 'Something went wrong' })
    }

    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Encoding': 'none',
      'Content-Type': 'text/event-stream; charset=utf-8',
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        return res.end('data: [DONE]\n\n') // TODO: Devolveremos otra cosa
      }

      const chunk = decoder.decode(value)
      const transformedChunk = chunk
        .split('\n')
        .filter(Boolean)
        .map((line) => line.replace('data: ', '').trim())

      for (const data of transformedChunk) {
        if (data === '[DONE]') {
          return res.end('data: [DONE]\n\n') // TODO: Devolveremos otra cosa
        }

        try {
          const json = JSON.parse(data)
          const { content } = json.choices?.[0]?.delta
          content && res.write(`data: ${JSON.stringify(content)}\n\n`)
          // res.write(`data: ${JSON.stringify({ content })}\n\n`)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  jwt.verify(req.token, keyPhrase, (err, token) => {
    if (err) {
      res.sendStatus(403)
      console.log('TOken no anda')
    } else {
      getMessage(req, res)
    }
  })
}

export const postUser = async (req, res) => {
  try {
    if (req.claveSecreta === 'adminprogrminibootca') {
      const newUser = await User(req.body)
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      newUser.password = hashedPassword
      const savedUser = await newUser.save()
      res.status(201).json(savedUser)
    } else {
      res.sendStatus(403)
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

export const tokensCounter = async (req, res) => {
  const { token, userId } = req.body
  try {
    await User.findByIdAndUpdate(userId, { $inc: { tokens: token } })
    res.status(200).json({ message: 'Tokens added successfully.' })
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

// Oobtener mensajes procesados
export const analyzeCode = async (req, res) => {
  try {
    const getCodeAnalysis = async (req, res) => {
      const { code, error } = req.body

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Analiza código para encontrar la solución al problema, muestra una porcion del codigo con el problema solucionado, no des una explicacion muy larga ni muy corta, ademas da algunas recomendaciones para no cometer el mismo error en el futuro`,
            },
            {
              role: 'user',
              content: `Este es el codigo: '${code}' y este es el error: '${error}'`,
            },
          ],
          stream: true, // esto luego lo pondremos en true
          temperature: 0.0,
          stop: ['\ninfo:'],
        }),
      })

      if (!response.ok) {
        console.error(response.statusText)
        return res.status(500).json({ error: 'Something went wrong' })
      }

      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Encoding': 'none',
        'Content-Type': 'text/event-stream; charset=utf-8',
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          return res.end('data: [DONE]\n\n') // TODO: Devolveremos otra cosa
        }

        const chunk = decoder.decode(value)
        const transformedChunk = chunk
          .split('\n')
          .filter(Boolean)
          .map((line) => line.replace('data: ', '').trim())

        for (const data of transformedChunk) {
          if (data === '[DONE]') {
            return res.end('data: [DONE]\n\n') // TODO: Devolveremos otra cosa
          }

          try {
            const json = JSON.parse(data)
            const { content } = json.choices?.[0]?.delta
            content && res.write(`data: ${JSON.stringify(content)}\n\n`)
            // res.write(`data: ${JSON.stringify({ content })}\n\n`)
          } catch (error) {
            console.error(error)
          }
        }
      }
    }

    jwt.verify(req.token, keyPhrase, (err, token) => {
      if (err) {
        res.sendStatus(403)
        console.log('Token no anda')
      } else {
        getCodeAnalysis(req, res)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// Procesar Mensajes de los usuarios
export const processMessages = async (req, res) => {
  try {
    let allMessages = await Message.find()
    let messagesCount = allMessages.length
    let loops = Math.ceil(messagesCount / 25)
    let skipValue = 0

    let allWordKeys = []

    for (let i = 0; i < loops; i++) {
      let cleanMessages = []

      const messages = await Message.find().skip(skipValue).limit(25)
      messages.forEach((message) => {
        cleanMessages = [...cleanMessages, message.message]
      })

      const params = {
        LanguageCode: 'es',
        TextList: cleanMessages,
      }
      const data = await comprehend.send(
        new BatchDetectKeyPhrasesCommand(params)
      )

      data.ResultList.forEach((result) => {
        let keyFrases = result.KeyPhrases

        keyFrases.map((key) => {
          let keyFrase = key.Text

          allWordKeys = [...allWordKeys, keyFrase]
        })
      })

      skipValue += 25
    }

    await WordKey.findOneAndUpdate(
      { _id: '6434cfbea482cfc81ee29719' },
      { wordKeys: allWordKeys },
      { upsert: true }
    )

    console.log('Se actualizan los WORDKEYS')
  } catch (err) {
    console.error(err)
  }
}

export const getKeyWords = async (req, res) => {
  try {
    const getWordKey = async (req, res) => {
      const allWordKey = await WordKey.find()
      res.status(200).json(allWordKey)
    }

    jwt.verify(req.token, keyPhrase, (err, token) => {
      if (err) {
        res.sendStatus(403)
        console.log('Token no anda')
      } else {
        getWordKey(req, res)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ocurrió un error al obtener las wordkeys' })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id)
    res.status(200).json(deletedMessage)

    if (!deletedMessage) {
      res.status(404).json({ error: 'Message no encontrado' })
    }
  } catch (err) {
    console.err(err)
  }
}
