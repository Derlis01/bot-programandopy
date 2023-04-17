import React from 'react'
import { Link } from 'react-router-dom'
// import { useRouteError } from 'react-router-dom'

const NotFound = () => {
  // const error = useRouteError()

  return (
    <div className="bg-gray-900 text-white h-screen text-center">
      <h1 className="text-3xl">Te perdiste parece 😵</h1>
      <div className="flex flex-col">
        <Link
          className="text-lg font-medium text-blue-600 dark:text-blue-500 hover:underline"
          to={'/'}>
          Volver a Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
