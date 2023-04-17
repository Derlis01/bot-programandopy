import { Router } from 'express'
const route = Router()
import {
  analyzeCode,
  deleteMessage,
  getKeyWords,
  login,
  postMessage,
  postUser,
  tokensCounter,
  verifyAdmin,
  verifyDailyLimit,
  verifyToken,
} from '../controllers/controller.js'

//Endpoints usados
route.post('/api/post-user', verifyAdmin, postUser)
route.post('/api/login', login)
route.post('/api/post-message', verifyToken, verifyDailyLimit, postMessage)
route.post('/api/analyze-code', verifyToken, verifyDailyLimit, analyzeCode)
route.post('/api/token-counter', verifyToken, tokensCounter)
route.get('/api/get-keywords', verifyToken, getKeyWords)

//Endpoints no usados
route.get('/api/get/:id')
route.put('/api/edit/:id')
route.delete('/api/delete/:id', deleteMessage)

export default route
