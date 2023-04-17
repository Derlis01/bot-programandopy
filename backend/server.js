import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const port = process.env.PORT
import route from './server/routes/routes.js'
import './server/config/mongodb.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(route)

app.listen(port, () => console.log('server on port ' + port))
