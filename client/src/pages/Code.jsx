import React, { useState, useRef, useEffect } from 'react'
import InputCode from '../components/InputCode'
import InputCodeSubmit from '../components/InputCodeSubmit'
import GridLoader from 'react-spinners/GridLoader'
import axios from 'axios'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Code = () => {
  const userData = JSON.parse(localStorage.getItem('miniCampUser'))
  let userId = userData.id
  let tokens = 0

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [solution, setSolution] = useState('')
  const [showContent, setShowContent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)

  const startLoading = () => setIsLoading(true)

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [solution])

  const analyzeCode = async () => {
    try {
      startLoading()
      const response = await fetch(process.env.REACT_APP_URL_ANALYZE_CODE, {
        method: 'POST',
        body: JSON.stringify({
          code,
          error,
          userId,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
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
          'Parece que llegaste al límite de mensajes diarios. ¡El bot necesita una siesta para recargar pilas! Vuelve a las 00:00 para seguir conversando.'
        )
      }

      const stream = response.body
      const reader = stream.getReader()
      let data = ''
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
          while ((match = regex.exec(text))) {
            data += match[1]
            data = data.replace(/\\n/g, '\n').replace(/\\/g, '')
            tokens++
            setSolution(data)
          }
        }
      }

      setShowContent(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const solutionStyle = solution.includes('```')
    ? 'my-6 p-4 bg-gray-200 rounded-lg shadow-lg'
    : 'my-6 p-4 bg-gray-300 rounded-lg shadow-md'

  // Nueva lógica para detectar el código en el mensaje
  const codeRegex = /(```(.+?)\n([\s\S]+?)\n```|``(.+?)\n([\s\S]+?)\n``)/gm
  const matches = solution.matchAll(codeRegex)
  const messageParts = []

  if (matches) {
    let index = 0

    for (const match of matches) {
      if (match.index > index) {
        messageParts.push(solution.slice(index, match.index))
      }

      const language = match[2] || match[4]
      const code = match[3] || match[5]
      messageParts.push({ language, code })

      index = match.index + match[0].length
    }

    if (index < solution.length) {
      messageParts.push(solution.slice(index))
    }
  } else {
    messageParts.push(solution)
  }

  return (
    <div ref={bottomRef} className="flex flex-col items-center mt-10">
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
      {!showContent && (
        <div className="bg-gray-800 text-white w-3/5 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">
            ¿Problemas con tu código? 🧐
          </h1>
          <p>
            Muestrame tu código y el error que te da para estudiarlo y encontrar
            el posible fallo
          </p>
          <button
            onClick={() => setShowContent(true)}
            className="bg-blue-700 hover:bg-blue-800 mt-5 text-white font-bold py-2 px-4 rounded">
            Aceptar
          </button>
        </div>
      )}
      {showContent && (
        <>
          <h2 className="text-lg text-white font-semibold mb-4">
            Pega aquí tu código: ⬇️
          </h2>
          <div className="flex justify-center w-full mb-4">
            <InputCode setCode={setCode} />
          </div>
          <div className="flex flex-col items-center w-full mb-4">
            <h2 className="text-lg font-semibold mb-2 text-white">
              ¿Qué problema estás teniendo? 🤔
            </h2>
            <p className="text-gray-100 text-center mb-2">
              Describe el problema o pega el error que aparece en la consola:
            </p>
          </div>
          <div className="flex justify-center w-full mb-4">
            <InputCodeSubmit setError={setError} />
          </div>
          <button
            onClick={analyzeCode}
            className="flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded relative shadow-md">
            Analizar ahora
            {isLoading && (
              <div className="ml-2 flex items-center justify-center">
                <GridLoader size={2} color={'white'} />
              </div>
            )}
          </button>
          {solution && (
            <div className="flex flex-col bg-gray-900 text-white rounded-md items-center mt-10 w-4/5">
              <h1 className="text-2xl font-bold">Resultado 🔎</h1>
              <div className={`min-w-full bg-gray-700 ${solutionStyle}`}>
                <span className="font-normal">
                  {messageParts.map((part, i) => {
                    if (typeof part === 'string') {
                      return <span key={i}>{part}</span>
                    } else {
                      return (
                        <SyntaxHighlighter
                          key={i}
                          language={'javascript'}
                          style={vscDarkPlus}>
                          {part.code.trim()}
                        </SyntaxHighlighter>
                      )
                    }
                  })}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Code
