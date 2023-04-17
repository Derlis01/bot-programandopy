import { createBrowserRouter, Navigate } from 'react-router-dom'
import Chat from '../pages/Chat'
import Code from '../pages/Code'
import Layout from '../layout/Layout'
import { isMobile } from 'react-device-detect'
import NotFound from '../pages/NotFound'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Materiales from '../components/Materiales'
import Mobile from '../pages/Mobile'

const loginData = JSON.parse(localStorage.getItem('miniCampUser'))

export default createBrowserRouter(
  !isMobile
    ? [
        {
          path: '/',
          element: loginData ? <Layout /> : <Navigate to="/login" />,
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              element: <Chat />,
            },
            {
              path: 'code',
              element: <Code />,
            },
          ],
        },
        {
          path: 'dashboard',
          element: loginData ? <Dashboard /> : <Navigate to="/login" />,
        },
        {
          path: 'login',
          element: loginData ? <Navigate to="/" /> : <Login />,
        },
        {
          path: '/materiales',
          element: <Materiales />,
        },
      ]
    : [{ path: '/', element: <Mobile /> }]
)
