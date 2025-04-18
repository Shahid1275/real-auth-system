import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="flex items-center flex-col mt-20 px-4 text-center text-gray-800">
        <img src={assets.header_img} alt="header" className='w-36 h-36 rounded-full mb-6' />
        <h2 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Developer  <img src={assets.hand_wave} alt="hand " className='animate-waving-hand'/></h2>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Our App</h2>
        <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and running in no time !</p>   
        <button className='border border-gray-600 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all duration-200 cursor-pointer'>Get Started</button>    
    </div>
  )
}

export default Header