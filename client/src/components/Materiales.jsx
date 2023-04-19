import React from 'react'
import Nav from './Nav'
import { Link } from 'react-router-dom'

const Materiales = () => {
  return (
    <div className="bg-gray-900 h-screen">
      <Nav />
      <div className="flex justify-center flex-col items-center text-lg text-slate-50">
        <Link to={'https://programandopy.github.io/minibootcamp-v3/'}>
          Tareas y Docs
        </Link>
      </div>
    </div>
  )
}

export default Materiales
