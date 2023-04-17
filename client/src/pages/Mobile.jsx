import React from 'react'

const Mobile = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-900 text-slate-50 h-screen">
      <img
        style={{ width: '83.3%' }}
        src="https://media4.giphy.com/media/hhbsgAvBkZqkKx2ys7/giphy.gif?cid=ecf05e47145efu2yb45kyqlcodg5of7t26bxkks9z7rnsw2d&rid=giphy.gif&ct=g"
        alt="phone error"
      />
      <div className="bg-slate-800 p-10 rounded-md shadow-lg w-10/12">
        <h1 className="font-bold text-2xl">
          No disponible en dispositivos móviles :(
        </h1>
      </div>
    </div>
  )
}

export default Mobile
