import { motion } from "framer-motion"


const NewsLetterBox = () => {
    const onSubmitHandler = (e)=>{
        e.preventDefault()
    }
  return (
    <motion.div className='text-center' initial={{opacity:0,y:'50px'}} animate={{opacity:1,y:'0px'}} transition={{delay:0.2,duration:0.5}}>
        <p className='text-2xl font-medium text-gray-800 '>Subscribe now & got 20% off</p>
        <p className='text-gray-400 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat dolore adipisci maxime eum sapiente? Ratione?</p>
        <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' onSubmit={onSubmitHandler}>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter Your Email' required />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4 cursor-pointer'>SUBSCRIBE</button>
        </form>
    </motion.div>
  )
}

export default NewsLetterBox