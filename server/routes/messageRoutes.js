import express from 'express'
import {protectedRoute} from '../middleware/auth.js'
import { getMessages, getUsersForSidebar, markedMessageAsSeen, sendMessage } from '../controllers/messageController.js'

const messageRouter=express.Router()

// Define your message routes here
messageRouter.get('/users',protectedRoute,getUsersForSidebar)
messageRouter.get('/:id',protectedRoute,getMessages)
messageRouter.put('/mark/:id',protectedRoute,markedMessageAsSeen)
messageRouter.post('/send/:id',protectedRoute,sendMessage)


export default messageRouter