import React from 'react'

function InputCodeSubmit({ setError }) {
  const handleChange = (event) => {
    setError(event.target.value)
  }

  return (
    <textarea
      className="w-4/5 h-20 px-3 rounded-md text-gray-300 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
      type="text"
      placeholder="Cual es el problema?"
      onChange={handleChange}
    />
  )
}

export default InputCodeSubmit
