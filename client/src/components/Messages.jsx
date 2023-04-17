import React from 'react'
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'

const Messages = ({ message, role }) => {
  const messageStyle =
    role === 'user'
      ? 'bg-gradient-to-l from-blue-700 to-blue-600 text-white'
      : 'bg-gray-700 text-white'
  const containerStyle = role === 'user' ? 'ml-auto' : ''

  const hideSystemMessage = role === 'system' ? 'hidden' : ''

  const codeRegex = /(```(.+?)\n([\s\S]+?)\n```|``(.+?)\n([\s\S]+?)\n``)/gm
  const matches = message.matchAll(codeRegex)

  // Creamos un array vacío para guardar las partes del mensaje
  const messageParts = []

  // Usamos un índice para llevar la cuenta de dónde empieza cada parte
  let index = 0

  // Iteramos sobre las coincidencias de la expresión regular
  for (const match of matches) {
    // Si hay texto antes de la primera coincidencia, lo guardamos como una parte normal
    if (match.index > index) {
      messageParts.push(message.slice(index, match.index))
    }

    // Guardamos el lenguaje y el contenido del código como una parte especial
    const language = match[2] || match[4]
    const code = match[3] || match[5]
    messageParts.push({ language, code })

    // Actualizamos el índice al final de la última coincidencia
    index = match.index + match[0].length
  }

  // Si hay texto después de la última coincidencia, lo guardamos como una parte normal
  if (index < message.length) {
    messageParts.push(message.slice(index))
  }

  return (
    <div
      className={`flex my-2 max-w-lg ${containerStyle} ${hideSystemMessage}`}>
      <div className={`py-2 px-4 rounded-lg shadow-lg ${messageStyle}`}>
        <span>
          {/* Iteramos sobre las partes del mensaje y las renderizamos según su tipo */}
          {messageParts.map((part, i) => {
            if (typeof part === 'string') {
              // Si es una parte normal, solo mostramos el texto
              if (
                part.startsWith('`') &&
                part.endsWith('`') &&
                part.length === 2
              ) {
                // Si el texto está rodeado de un solo backtick, lo ponemos en negrita
                return (
                  <span
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: `<strong>${part.slice(1, -1)}</strong>`,
                    }}
                  />
                )
              } else {
                return part
              }
            } else {
              // Si es una parte especial, usamos el componente SyntaxHighlighter para mostrar el código con estilo
              return (
                <SyntaxHighlighter
                  key={i}
                  language={'javascript'}
                  style={vscDarkPlus}
                  showLineNumbers>
                  {part.code}
                </SyntaxHighlighter>
              )
            }
          })}
        </span>
      </div>
    </div>
  )
}

export default Messages
