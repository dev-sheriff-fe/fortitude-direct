"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import heroslider from "@/components/images/hero-slider.png";
import vrimage from "@/components/images/vr-image.png";
import pad from "@/components/images/pad.png";
import headphone from "@/components/images/headphone.png";

interface Slide {
  id: number;
  bgImage: string;
  productImage: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample slides data
  const slides: Slide[] = [
    {
      id: 1,
      bgImage: typeof heroslider === "string" ? heroslider : heroslider.src,
      productImage: typeof vrimage === "string" ? vrimage : vrimage.src,
      title: "Virtual reality (VR) headset",
      description: "Blur vertical flatten effect duplicate select content blur ellipse. Scrolling thumbnail asset style align fill editor object. Rectangle move figma distribute select auto font scrolling. Opacity arrange follower.",
      ctaText: "Buy Now",
      ctaLink: "/shop/vr-headset"
    },
    {
      id: 2,
      bgImage: typeof heroslider === "string" ? heroslider : heroslider.src,
      productImage: typeof pad === "string" ? pad : pad.src,
      title: "Next-gen gaming console",
      description: "Experience immersive gaming with our latest console technology. Ultra-fast loading, 4K resolution, and seamless gameplay.",
      ctaText: "Shop Now",
      ctaLink: "/shop/gaming-console"
    },
    {
      id: 3,
      bgImage: typeof heroslider === "string" ? heroslider : heroslider.src,
      productImage: typeof headphone === "string" ? headphone : headphone.src,
      title: "Noise-canceling headphones",
      description: "Immerse yourself in crystal-clear audio with our advanced noise cancellation technology. Comfortable over-ear design for extended listening sessions without fatigue.",
      ctaText: "Discover",
      ctaLink: "/shop/headphones"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length, isAnimating]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isAnimating) return;
    
    setIsAnimating(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    
    // Reset animation lock after transition completes
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Variants for smoother animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0
    })
  };

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15 + 0.3,
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1] // cubic-bezier for easeOut
      }
    })
  };

  // Responsive adjustments
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  
  // Calculate responsive container height
  const containerHeight = isMobile ? '500px' : isTablet ? '600px' : '700px';
  
  // Calculate responsive image size
  const productImageSize = isMobile ? 'max-h-[250px]' : isTablet ? 'max-h-[350px]' : 'max-h-[400px]';

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px] bg-[#313133]`}
      style={{ height: containerHeight }}
    >
      {/* Background image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${slides[currentSlide].bgImage})`,
            // Scale background based on screen size
            backgroundSize: isMobile ? 'cover' : 'cover',
            backgroundPosition: isMobile ? 'center center' : 'center center'
          }}
        />
      </AnimatePresence>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="container relative h-full mx-auto px-4 sm:px-6 flex items-center">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12 z-5 w-full md:ml-15"
          >
            {/* Product image (left side on larger screens, top on mobile) */}
            <motion.div 
              className="w-full md:w-1/2 flex justify-center order-1 md:order-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                transition: { delay: 0.2, duration: 0.6, ease: "backOut" }
              }}
            >
              <img
                src={slides[currentSlide].productImage}
                alt={slides[currentSlide].title}
                className={`${productImageSize} object-contain`}
              />
            </motion.div>

            {/* Content (right side on larger screens, bottom on mobile) */}
            <div className="w-full md:w-1/2 text-white space-y-4 md:space-y-6 order-1 md:order-2 md:text-left md:ml-15">
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
                custom={0}
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl max-w-lg mx-auto md:mx-0 "
                custom={1}
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                {isMobile 
                  ? `${slides[currentSlide].description.substring(0, 100)}...` 
                  : slides[currentSlide].description
                }
              </motion.p>
              
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={contentVariants}
                className="flex justify-start"
              >
                <Link
                  href={slides[currentSlide].ctaLink}
                  className="inline-flex items-center bg-white text-[#d8480b] px-5 py-2 sm:px-6 sm:py-3 rounded-full font-medium hover:bg-gray-100 transition-colors group text-sm sm:text-base"
                >
                  {slides[currentSlide].ctaText}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots - position based on screen size */}
        <div className={`absolute ${isMobile ? 'bottom-4 left-1/2 transform -translate-x-1/2' : 'right-6 bottom-8'} flex gap-2 z-5`}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-4 sm:w-6' : 'bg-white/50 hover:bg-white/70'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}