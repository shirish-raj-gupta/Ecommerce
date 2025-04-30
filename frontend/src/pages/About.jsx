import React from 'react'
import Title from '../components/Title'
import {assets} from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
    <div className='text-2xl text-center pt-8 border-t'>
      <Title text1={'About'} text2={'Us'}/>
    </div>
    <div className='my-10 flex flex-col md:flex-row gap-16'>
      <img src={assets.about_img} alt="about" className='w-full md:max-w-[450px]'/>
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
      <p>about us</p>
      <p>good to go</p>
      <b className='text-gray-800'>Our Mission</b>
      <p>going good</p>
      </div>
     

    </div>
    <div className='text-xl py-4 '>
        <Title text1={'Why'} text2={'Choose us'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Yeah We are good</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Yeah We are good</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptiional Customer Service:</b>
          <p className='text-gray-600'>Yeah We are good</p>
        </div>

      </div>
      <NewsletterBox/>
    </div>
  )
}

export default About