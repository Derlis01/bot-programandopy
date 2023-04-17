import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
import Nav from '../components/Nav'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Dashboard = () => {
  const [data, setData] = useState([])
  const userData = JSON.parse(localStorage.getItem('miniCampUser'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_URL_GET_KEYWORDS,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        )
        setData(response.data[0].wordKeys)
      } catch (error) {
        if (error.response.status === 403) {
          toast.error(
            'Su sesión ha expirado. Será redirigido al inicio de sesión en unos segundos.'
          )
          setTimeout(() => {
            localStorage.removeItem('miniCampUser')
            window.location.reload()
          }, 5000) // Espera 5 segundos antes de ejecutar las acciones
        } else {
          console.error(error)
        }
      }
    }
    fetchData()
  }, [userData.token])

  // Contar la frecuencia de cada palabra o frase en la respuesta de la API
  const counts = data.reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr] += 1
    } else {
      acc[curr] = 1
    }
    return acc
  }, {})

  for (const key in counts) {
    counts[key] = parseInt(counts[key])
  }

  console.log(counts)

  const barSeries = [
    {
      name: 'Cantidad',
      data: Object.values(counts),
    },
  ]

  const barOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
    },
    theme: {
      mode: 'dark',
      palette: 'palette1',
    },
    xaxis: {
      categories: Object.keys(counts),
    },
  }

  const dataTree = {
    data: Object.entries(counts).map(([x, y]) => ({ x, y })),
  }

  const options = {
    chart: {
      type: 'treemap',
      background: 'transparent',
    },
    theme: {
      mode: 'dark',
      palette: 'palette1', // Selecciona una paleta de colores oscuros predefinida
    },
    series: [dataTree],
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b bg-gray-700">
      <ToastContainer theme="dark" />
      <Nav />
      <div className="flex-1 p-4 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-50 mb-4">
          Términos frecuentes en preguntas estudiantiles:
        </h2>
        <div className="flex justify-center gap-8">
          <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <Chart
              options={barOptions}
              series={barSeries}
              width="400"
              type="bar"
            />
          </div>
          <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <Chart
              options={options}
              series={options.series}
              width="400"
              type="treemap"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
