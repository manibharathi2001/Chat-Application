import mongoose from 'mongoose'
// Function to connect mongo DB

export const connectDB=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log("Database Connented"))
        await mongoose.connect(`${process.env.MONGO_URI}/chat-app`)
    } catch(error){
        console.log("Error in DB connection",error)
    }
}