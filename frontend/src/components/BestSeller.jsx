import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([])

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller))
        setBestSeller(bestProduct.slice(0,5))
    },[products])
  return (
    <motion.div className='my-10' initial={{opacity:0, x:'100px'}} animate={{opacity:1,x:'0px'}} transition={{delay:0.3,duration:0.8}}>
        <div className='text-center text-2xl sm:text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLER'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores qui nam molestiae deleniti pariatur commodi illum animi unde sint eum.</p>
        </div>
        {
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} id={item._id} image={item.image} price={item.price} name={item.name}/>
                ))
            }
            </div>
        }
    </motion.div>
  )
}

export default BestSeller