'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { apiClient } from '../lib/api';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  title: string;
  review: string;
  rating: number;
  avatar?: string;
}

interface ApiTestimonial {
  id: number;
  title: string;
  image: string;
  content: string;
}

interface TestimonialSectionProps {
  className?: string;
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Default fallback testimonials
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: "John Dee",
      role: "Guest Review",
      title: "Most Attractive Packages!",
      review: "This is such a great idea! I've had a subscription for a few months now and recently used the service to book a flight to ...",
      rating: 5,
    },
    {
      id: 2,
      name: "Emily Clark",
      role: "Traveler",
      title: "Seamless Experience!",
      review: "I booked two trips using SoarFare and it was seamless! Affordable and flexible payment options made my dream vacation possible.",
      rating: 5,
    },
    {
      id: 3,
      name: "Michael Ross",
      role: "Frequent Flyer",
      title: "Highly Recommended!",
      review: "Highly recommend! The rewards points really help me save on frequent travel. The subscription model is brilliant for regular travelers.",
      rating: 5,
    }
  ];

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.getTestimonials();
        
        if (response.success && response.data && response.data.length > 0) {
          // Convert API data to component format and limit to 5
          const apiTestimonials: Testimonial[] = response.data.slice(0, 5).map((item: ApiTestimonial) => ({
            id: item.id,
            name: item.title,
            role: "Guest Review",
            title: "Amazing Experience!",
            review: item.content,
            rating: 5,
            avatar: item.image
          }));
          
          setTestimonials(apiTestimonials);
        } else {
          // Use default testimonials if API fails or returns no data
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // Use default testimonials on error
        setTestimonials(defaultTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-[#FFD700]' : 'text-gray-400'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const slideVariants = {
    enter: {
      opacity: 0,
      y: 20,
    },
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn" as const
      }
    }
  };

  return (
    <section className={`w-full bg-gradient-to-b from-[#0C2442] to-[#142C4B] py-20 ${className}`}>
      <div className="w-[80%] mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Left Column - Image */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[650px]">
              <Image
                src="/testimonail.jpg"
                alt="Happy travelers testimonial"
                fill
                className="object-cover rounded-3xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>

          {/* Right Column - Testimonial Content */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            {/* Section Header */}
            <div className="mb-8">
              <motion.p 
                variants={itemVariants}
                className="text-blue-300 text-sm md:text-base font-medium mb-4 uppercase tracking-wide"
              >
                TESTIMONIAL
              </motion.p>
              
              <motion.h2 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-normal text-white leading-tight">
                What Our Customer Say Us
              </motion.h2>
            </div>

            {/* Testimonial Slider */}
            <div className="relative min-h-[300px]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
                </div>
              ) : testimonials.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    {/* Review Title */}
                    <h3 className="text-lg md:text-xl font-normal text-white mb-4">
                      {testimonials[currentIndex].title}
                    </h3>

                    {/* Star Rating */}
                    <div className="flex items-center mb-6">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>

                    {/* Review Text */}
                    <p
                      className="text-white/80 text-base md:text-lg leading-relaxed mb-8 overflow-hidden"
                      style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '4.5em', // Ensures at least 3 lines (adjust based on font-size/line-height)
                      maxHeight: '6.5em', // Clamp to 5 lines
                      }}
                    >
                      {testimonials[currentIndex].review}
                    </p>

                    {/* Reviewer Info */}
                    <div className="flex items-center">
                      {/* Avatar */}
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-300/20 border-2 border-blue-300/30 flex items-center justify-center mr-4 overflow-hidden">
                        {testimonials[currentIndex]?.avatar ? (
                          <Image
                            src={
                              testimonials[currentIndex].avatar.startsWith('http')
                                ? testimonials[currentIndex].avatar
                                : `https://soarfare.com/${testimonials[currentIndex].avatar.replace(/^\/+/, '')}`
                            }
                            alt={testimonials[currentIndex].name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-300/40 flex items-center justify-center">
                            <svg 
                              className="w-4 h-4 md:w-5 md:h-5 text-white" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Name and Role */}
                      <div>
                        <h4 className="text-white font-bold text-base md:text-lg">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-white/60 text-sm">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : null}
            </div>

            {/* Dot Navigation */}
            {!isLoading && testimonials.length > 0 && (
              <div className="flex items-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentIndex 
                        ? 'bg-blue-300' 
                        : 'bg-[#9CA3AF]'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Quote Icon */}
            <div className="absolute bottom-0 right-0 opacity-80">
              <Image
                src="/quote.svg"
                alt="Quote"
                width={120}
                height={120}
                className="text-blue-300"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
