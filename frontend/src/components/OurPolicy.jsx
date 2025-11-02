
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <motion.div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700' initial={{opacity:0,y:'50px'}} animate={{opacity:1,y:'0px'}} transition={{delay:0.2,duration:0.5}}>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-5'/>
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>We offer hassle free exchange policy</p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-5'/>
            <p className='font-semibold'>7 Days Return Policy</p>
            <p className='text-gray-400'>We Provide 7 Days free return policy</p>
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-5'/>
            <p className='font-semibold'>Best Customer Support</p>
            <p className='text-gray-400'>we provide 24/7 customer support</p>
        </div>
    </motion.div>
  )
}

export default OurPolicy