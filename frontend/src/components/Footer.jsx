
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <motion.div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm' initial={{opacity:0,y:'50px'}} animate={{opacity:1,y:'0px'}} transition={{delay:0.2,duration:0.5}}>
        <div>
            <img src={assets.logo} className='mb-5 w-32'/>
            <p className='w-full md:w-2/3 text-gar-600 text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta est laudantium, aspernatur accusantium, quisquam excepturi recusandae reiciendis aperiam iste nobis neque, ratione blanditiis delectus sequi fugiat optio vel officia vitae! Nostrum, rerum! Saepe totam, fuga, dolorem, distinctio ducimus aliquid harum doloribus error corporis dolores laborum amet quibusdam. Sapiente, minus eligendi.</p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gary-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 12345 78910</li>
                <li>contact@foreveryou.com</li>
            </ul>
        </div>

        
    </div>
    <div className='w-full'>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ forever.com - All Right Reserved.</p>
        </div>
    </motion.div>
  )
}

export default Footer