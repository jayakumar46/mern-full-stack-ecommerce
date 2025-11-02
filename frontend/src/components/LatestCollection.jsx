import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { motion } from 'framer-motion'
const LatestCollection = () => {
    const {products} = useContext(ShopContext)
    const [latestProducts,setLatestProducts] = useState([])

    useEffect(()=>{
        setLatestProducts(products.slice(0,10))
    },[products])
  return (
    <motion.div className='my-10' initial={{opacity:0,x:'-100px'}} animate={{opacity:1,x:'0px'}} transition={{delay:0.3, duration:0.7}}>
        <div className='text-center py-8  text-2xl sm:text-3xl'>
            <Title text1={'LATEST'} text2={'COLLECTION'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore facilis incidunt cum iusto quia quis quidem accusantium minus odit mollitia?</p>
        </div>
        {/* Redering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                latestProducts.map((item,index)=>(
                    <ProductItem key={index} id={item._id} image={item.image} price={item.price} name={item.name}/>
                ))
            }
        </div>
    </motion.div>
  )
}

export default LatestCollection