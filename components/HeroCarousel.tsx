"use client"

import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';


const heroImages=[
    {ImageUrl:"/assets/images/hero-1.svg",alt:"smartwatch"},
    {ImageUrl:"/assets/images/hero-2.svg",alt:"bag"},
    {ImageUrl:"/assets/images/hero-3.svg",alt:"lamp"},
    {ImageUrl:"/assets/images/hero-4.svg",alt:"air fryer"},
    {ImageUrl:"/assets/images/hero-5.svg",alt:"chair"},
]

const HeroCarousel = () => {
  return (
    <div className='hero-carousel'>
        <Carousel
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={2000}
        showArrows={false}
        showStatus={false }

    >
        {heroImages.map((image)=>(
            <Image
                src={image.ImageUrl}
                alt={image.alt}
                key={image.alt}
                className='object-contain'
                height={484}
                width={484}
            />
        ))}
    </Carousel>
    </div>
    
  )
}

export default HeroCarousel