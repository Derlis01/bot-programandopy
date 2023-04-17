import React from 'react'

function InputCode({ setCode }) {
  const handleChange = (event) => {
    setCode(event.target.value)
  }

  return (
    <textarea
      className="w-4/5 h-40 px-3 rounded-md text-gray-300 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
      type="text"
      placeholder="Pega tu codigo aqui..."
      maxLength={4000}
      onChange={handleChange} // añadir el valor actual del input
    />
  )
}

export default InputCode
