import { useState, useEffect } from 'react'
import ProgramandoLogo from '../images/programando-logo.svg'
import { FaUserCircle } from 'react-icons/fa'
import '../components/Nav.css'
import { Link } from 'react-router-dom'

const Nav = () => {
  const [myData, setMyData] = useState({})
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('miniCampUser'))
    setMyData(data)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('miniCampUser')
    window.location.reload()
    setMyData({})
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="flex justify-between items-center h-20 bg-slate-800 text-white">
      <Link to="/" className="ml-14">
        <img
          style={{ height: '60px' }}
          id="programando-logo"
          src={ProgramandoLogo}
          alt="Programando logo"
        />
      </Link>

      <div className="flex mr-14">
        <Link
          to="https://programandopy.github.io/minibootcamp-v3/"
          target="about:blank"
          className="font-bold mr-3 text-violet-400">
          Materiales
        </Link>
        <div href="/" className="font-normal mr-3">
          {myData ? (
            `Bienvenido, ${myData.name}!`
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
        {myData ? (
          <div
            href="/"
            className="font-medium mr-3 flex items-center justify-center cursor-pointer"
            onClick={toggleMenu}>
            <FaUserCircle />
          </div>
        ) : (
          ''
        )}
      </div>

      {isOpen && (
        <div className="absolute top-20 z-50 right-10 bg-gray-800 text-slate-50 shadow-lg p-2">
          <button className="font-medium" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Nav
