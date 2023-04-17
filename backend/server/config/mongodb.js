import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
async function connectDB() {
  try {
    await mongoose.connect(`${process.env.URI_DATABASE}/Programando-Users`, {})
    console.log('Conectado a la base de datos correctamente')
  } catch (err) {
    console.error(err)
  }
}

mongoose.set('strictQuery', false)

connectDB()
