import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

//signup new user
export const signup=async(req,res)=>{
    const {email,fullname,bio,password}=req.body
    try{
        //check if user already exists
        if (!fullname || !email || !password || !bio){
            return res.json({success:false,message:"Missing Details"})
        }
        const existingUser=await User.findOne({email})
        if (existingUser){
            return res.json({success:true,message:"User Already Exits!"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=await User.create({fullname,email,password:hashedPassword,bio})
        const token=generateToken(newUser._id)
        res.json({success:true,userData:newUser,token,message:"Account Created Successfully"})
    }catch(error){
        console.log("Error in Signup",error)
        res.json({success:false,message:"error.message"})

    }
}

//User Login to a user 

export const login = async (req, res) => {
  try {
    console.log('Incoming login body:', req.body);
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // find the user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    // check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    // ✅ generate token for this user (fix)
    const token = generateToken(user._id);

    // respond
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname, // matches schema
        bio: user.bio || ''
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//controller to check if user is authenticated

export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user})
}

//controller to update user profile details

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic,bio,fullname}=req.body
        const userId=req.user._id
        let updatedUser

        if (!profilePic){
          updatedUser=  await User.findById(userId,{bio,fullname},{new:true})
        }else{
            const upload=await cloudinary.uploader.upload(profilePic)
            updatedUser=await User.findById(userId,{profilePic:upload.secure_url,bio,fullname},{new:true})
        }
        res.json({success:true,user:updatedUser})

    }catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})

    }
}