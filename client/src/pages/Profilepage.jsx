import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Profilepage = () => {
  const {authUser,updateProfile}=useContext(AuthContext)
  const [image,setImage]=useState(null)
  const navigate=useNavigate()
  const [name,setName]=useState(authUser.fullname)
  const [bio,setBio]=useState(authUser.bio)

  const handleSubmit=async(e)=>{

    e.preventDefault();
    if (!image){
      await updateProfile({fullname:name,bio})
      navigate('/')
      return;
    }
    const render=new FileReader()
    render.readAsDataURL(image)
    render.onload=async ()=>{
      const base64Image=render.result
      await updateProfile({profilePic:base64Image,fullname:name,bio})
      navigate('/')
    }
    

  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='test-lg '>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file"  id='avatar' accept='.png,.jpeg,.jpg' hidden/>
            <img src={image?URL.createObjectURL(image):assets.avatar_icon} alt="" className={`w-12 h-12 ${image && 'rounded-full'}`}/> 
            Upload Profile Image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" name="" id="" required placeholder='Your Name' className='p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio}  required placeholder='Short Bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <img src={ authUser?.profilePic||assets.logo_icon} className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${image && 'rounded-full'}`} alt="" />
      </div>
        
    </div>
  )
}

export default Profilepage