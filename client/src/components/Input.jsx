import React, { useState } from 'react'

function Input({ sendMessage }) {
  const [value, setValue] = useState({ content: '', role: 'user' })

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(value)
    sendMessage(value)
    setValue({ content: '', role: 'user' }) // actualizar el estado del valor del input a una cadena vacía
  }

  const handleChange = (event) => {
    setValue({ ...value, content: event.target.value })
  }

  return (
    <form className="flex justify-center m-3" onSubmit={handleSubmit}>
      <input
        className="w-4/5 h-10 px-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-700"
        type="text"
        placeholder="Explícame las condicionales de JavaScript con objetos de la vida real"
        maxLength="250"
        onChange={handleChange}
        value={value.content} // añadir el valor actual del input
      />
      <button
        type="submit"
        className="ml-2 py-2 px-4 rounded-lg bg-blue-700 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Enviar
      </button>
    </form>
  )
}

export default Input
