import React from 'react'
import {assets} from '../assets/assets'
import {motion} from 'framer-motion'
const Hero = () => {
  return (
    <motion.div className='flex flex-col sm:flex-row border border-gray-400' initial={{opacity:0,y:'-50px'}} animate={{opacity:1,y:'0px'}} transition={{delay:0.2,duration:0.5}}>
        {/* Hero left side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base'> SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                </div>
            </div>
        </div>
        {/* hero right side */}
        <img src={assets.hero_img} className='w-full sm:w-1/2' />
    </motion.div>
  )
}

export default Hero