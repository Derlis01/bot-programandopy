import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import Nav from '../components/Nav'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const initialValues = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Correo electrónico no válido')
      .required('El correo electrónico es obligatorio'),
    password: Yup.string()
      .required('La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  })

  const handleSubmit = async (values) => {
    try {
      const { email, password } = values

      const response = await axios.post(process.env.REACT_APP_URL_LOGIN_GET, {
        email,
        password,
      })

      if (response.data.token) {
        localStorage.setItem('miniCampUser', JSON.stringify(response.data))
        window.location.reload()
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error('Correo o contraseña incorrecta')
      }
    }
  }

  return (
    <div>
      <Nav />
      <div className="flex flex-col justify-items-start items-center bg-slate-900 h-screen">
        <h1 className="text-3xl text-slate-50 mb-10 mt-10">Ingresar al Bot</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ errors, touched, values }) => (
            <Form className="bg-gray-800 px-8 py-6 w-96 h-72 rounded-lg shadow-lg">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-white font-bold mb-2">
                  Correo electrónico:
                </label>
                <Field
                  name="email"
                  type="email"
                  className="px-4 py-2 w-full text-gray-100 bg-gray-700 rounded-lg focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  className="text-red-500 text-sm"
                  component="div"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-white font-bold mb-2">
                  Contraseña:
                </label>
                <Field
                  name="password"
                  type="password"
                  className="px-4 py-2 w-full text-gray-100 bg-gray-700 rounded-lg focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  className="text-red-500 text-sm"
                  component="div"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:shadow-outline-indigo active:bg-blue-600">
                Iniciar sesión
              </button>
            </Form>
          )}
        </Formik>
        <ToastContainer theme="dark" />
      </div>
      <div>
        <h1>Made by ex-mini-bootcamp student</h1>
      </div>
    </div>
  )
}

export default Login
