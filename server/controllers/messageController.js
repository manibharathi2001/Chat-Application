// get all users except logged in user

import message from "../models/message.js"
import user from "../models/user.js"
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filteredUsers = await user.find({ _id: { $ne: userId } }).select("-password")

        //count no of unread messages 
        const unseenMessages = {}
        const promises = filteredUsers.map(async (users) => {
            const messages = await message.find({ senderId: users._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[users._id] = messages.length
            }

        })
        await Promise.all(promises)
        res.json({ success: true, users: filteredUsers, unseenMessages })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })


    }
}

//get all  messages for selected chat user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params
        const myId = req.user._id
        const messages = await message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        })
        await message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true })
        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })


    }
}

//API to mark the message as seen using msg id

export const markedMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        await message.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true, message: "Message marked as seen" })

    } catch (error) {

        console.log(error.message);
        res.json({ success: false, message: error.message })


    }
}

//API to send a message to a user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const receiverId = req.params.id
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = await message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        //emit the message to receiver if online using socket.io
        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.json({ success: true, newMessage })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}