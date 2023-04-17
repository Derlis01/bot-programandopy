import React, { useState, useEffect, useRef } from 'react'
import Input from '../components/Input'
import Messages from '../components/Messages'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Chat = () => {
  const userData = JSON.parse(localStorage.getItem('miniCampUser'))
  let userId = userData.id
  let tokens = 0
  const messagesEndRef = useRef(null)

  const [allMessages, setAllMessages] = useState([
    {
      role: 'system',
      content:
        'Eres una asistente de programacion, eres el bot del mini-bootcamp de la organizacion Programando Paraguay y debes ayudar a los alumnos con temas de programacion y tecnologia, ten en cuenta que recien estan empezando, cuando muestres codigo trata de ser explicar cada parte con comentarios dentro del codigo',
    },
  ])

  const sendMessage = async (message) => {
    setAllMessages((prevMessages) => [...prevMessages, message])
    const aiMessage = {
      content: '',
      role: 'assistant',
    }
    setAllMessages((prevMessages) => [...prevMessages, aiMessage])

    const response = await fetch(process.env.REACT_APP_URL_POST_MESSAGE, {
      method: 'POST',
      body: JSON.stringify({
        message,
        allMessages,
        userId,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
      },
      mode: 'cors',
    })

    if (response.status === 403) {
      toast.error(
        'Su sesión ha expirado. Será redirigido al inicio de sesión en unos segundos.'
      )
      setTimeout(() => {
        localStorage.removeItem('miniCampUser')
        window.location.reload()
      }, 5000) // Espera 5 segundos antes de ejecutar las acciones
    }

    if (response.status === 429) {
      toast.warning(
        'Parece que te pasaste del límite de mensajes diarios. ¡El bot necesita una siesta para recargar pilas! Vuelve a las 00:00 para seguir conversando.'
      )
    }

    const stream = response.body
    const reader = stream.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        let TokensToSend = tokens * 1.53
        axios.post(
          process.env.REACT_APP_URL_TOKEN_COUNTER,
          {
            token: TokensToSend,
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        )
        break
      }
      if (value) {
        const text = new TextDecoder('utf-8').decode(value)
        const regex = /data: "(.*)"/g
        let match
        let data = ''
        while ((match = regex.exec(text))) {
          data += match[1]
        }

        tokens++
        data = data.replace(/\\n/g, '\n').replace(/\\/g, '')

        setAllMessages((prevMessages) => {
          const messages = [...prevMessages]
          messages[messages.length - 1].content += data
          return messages
        })
      }
    }
  }

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages])

  return (
    <div className="flex flex-col h-full justify-between">
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex flex-col flex-grow" style={{ position: 'relative' }}>
        <div
          className="p-5 flex flex-col flex-grow"
          style={{ paddingBottom: '50px' }}>
          {allMessages.map((message, index) => (
            <Messages
              key={index}
              message={message.content}
              role={message.role}
            />
          ))}
        </div>
        <div ref={messagesEndRef} className="m-1">
          <h2>ㅤ</h2>
        </div>
        <div
          style={{
            position: 'fixed',
            width: '80%',
            bottom: 0,
            height: '80px',
          }}>
          <div className="flex justify-center to-gray-900 items-center">
            <div className="w-4/5">
              <Input sendMessage={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
