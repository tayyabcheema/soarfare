import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, useMotionValue } from 'framer-motion';

interface DestinationCard {
  id: number;
  originCode: string;
  originCity: string;
  originCountry: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  flightType: 'single' | 'return' | 'multi';
  multiDestination?: {
    code: string;
    city: string;
    country: string;
  };
  image: string;
  points: number;
}

const PopularDestinationsSlider = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const x = useMotionValue(0);
  
  const destinationData: DestinationCard[] = [
    {
      id: 1,
      originCode: 'DXB',
      originCity: 'Dubai',
      originCountry: 'UAE',
      destinationCode: 'SPX',
      destinationCity: 'Giza',
      destinationCountry: 'Egypt',
      flightType: 'return',
      image: '/destination1.jpg',
      points: 192
    },
    {
      id: 2,
      originCode: 'DXB',
      originCity: 'Dubai',
      originCountry: 'UAE',
      destinationCode: 'IST',
      destinationCity: 'Istanbul',
      destinationCountry: 'Turkey',
      flightType: 'single',
      image: '/destination2.jpg',
      points: 192
    },
    {
    id: 3,
      originCode: 'DXB',
      originCity: 'Dubai',
      originCountry: 'UAE',
      destinationCode: 'IST',
      destinationCity: 'Istanbul',
      destinationCountry: 'Turkey',
      flightType: 'single',
      image: '/destination4.jpg',
      points: 192
    },
    {
      id: 4,
      originCode: 'DXB',
      originCity: 'Dubai',
      originCountry: 'UAE',
      destinationCode: 'LHR',
      destinationCity: 'London',
      destinationCountry: 'UK',
      flightType: 'single',
      image: '/destination5.jpg',
      points: 192
    },
    {
      id: 5,
      originCode: 'DXB',
      originCity: 'Dubai',
      originCountry: 'UAE',
      destinationCode: 'JFK',
      destinationCity: 'New York',
      destinationCountry: 'USA',
      flightType: 'return',
      image: '/destination3.jpg',
      points: 192
    }
  ];

  // Duplicate data for seamless looping
  const loopedData = [...destinationData, ...destinationData, ...destinationData];

  // Continuous scroll animation with active index tracking
  useEffect(() => {
    if (isHovered) return;

    const animate = () => {
      const currentX = x.get();
      const cardWidth = 400; // Approximate card width + spacing
      
      // Move slowly and continuously
      x.set(currentX - 0.3);
      
      // Update active index based on position
      const newIndex = Math.floor(Math.abs(currentX) / cardWidth) % destinationData.length;
      setActiveIndex(newIndex);
      
      // Reset position for infinite loop
      if (currentX <= -cardWidth * destinationData.length) {
        x.set(0);
      }
    };

    const interval = setInterval(animate, 16); // ~60fps
    return () => clearInterval(interval);
  }, [isHovered, x, destinationData.length]);

  // Navigation handlers
  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? destinationData.length - 1 : activeIndex - 1;
    const cardWidth = 400;
    const targetX = -newIndex * cardWidth;
    x.set(targetX);
    setActiveIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === destinationData.length - 1 ? 0 : activeIndex + 1;
    const cardWidth = 400;
    const targetX = -newIndex * cardWidth;
    x.set(targetX);
    setActiveIndex(newIndex);
  };

  // Dot click handler
  const handleDotClick = (index: number) => {
    const cardWidth = 400;
    const targetX = -index * cardWidth;
    x.set(targetX);
    setActiveIndex(index);
  };

  const renderFlightPath = (card: DestinationCard) => {
    switch (card.flightType) {
      case 'single':
        return (
          <div className="flex items-center justify-center">
            <Image 
              src="/single_dest.svg.svg" 
              alt="single destination flight path" 
              width={180} 
              height={48} 
              className="w-full h-6"
            />
          </div>
        );
      case 'return':
        return (
          <div className="flex items-center justify-center ">
            <Image 
              src="/return_dest.svg" 
              alt="return flight path" 
              width={120} 
              height={32} 
              className="w-full h-10"
            />
          </div>
        );
      case 'multi':
        return (
          <div className="flex items-center justify-center text-xs px-2">
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
            <div className="flex-1 border-t-2 border-dotted border-white/60 mx-2" />
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 border-t-2 border-dotted border-white/60 mx-2" />
            <div className="w-2 h-2 rounded-full bg-white/80"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-none">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 lg:mb-16 px-4"
        >
          {/* Small heading */}
          <motion.p 
            variants={cardVariants}
            className="text-blue-300 text-sm md:text-base font-medium mb-4"
          >
            Get there with Soarfare
          </motion.p>
          
          {/* Main heading */}
          <motion.h2 
            variants={cardVariants}
            className="text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-[#0C2340] leading-tight mb-12"
          >
            Popular Destinations On SoarFare
          </motion.h2>
        </motion.div>

        {/* Slider Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Reduced height slider */}
          <div className="relative h-[320px] md:h-[360px] lg:h-[400px]">
            <motion.div
              ref={containerRef}
              className="flex space-x-6 absolute left-0"
              style={{ x }}
            >
              {loopedData.map((card, index) => {
                const cardIndex = index % destinationData.length;
                const isSearchCard = cardIndex === activeIndex; // Show search on active card
                
                return (
                  <div
                    key={`${card.id}-${index}`}
                    className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] xl:w-[380px] h-[300px] md:h-[340px] lg:h-[380px] relative"
                  >
                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg">
                      <Image
                        src={card.image}
                        alt={`${card.destinationCity}, ${card.destinationCountry}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
                      
                      {/* Card Content */}
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                        {/* Top Section - Flight Route */}
                        <div className="flex items-start justify-between">
                          {/* Origin */}
                          <div className="text-white">
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">
                              {card.originCode}
                            </div>
                            <div className="text-xs md:text-sm font-light opacity-80">
                              {card.originCity}
                            </div>
                            <div className="text-xs font-light opacity-60">
                              {card.originCountry}
                            </div>
                          </div>
                          
                          {/* Flight Path */}
                          <div className=" py-2 min-h-[40px] flex items-center">
                            {renderFlightPath(card)}
                          </div>

                          {/* Multi-city destination (if exists) */}
                          {card.flightType === 'multi' && card.multiDestination && (
                            <div className="text-white text-center mx-4">
                              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">
                                {card.multiDestination.code}
                              </div>
                              <div className="text-xs md:text-sm font-light opacity-80">
                                {card.multiDestination.city}
                              </div>
                            </div>
                          )}
                          
                          {/* Destination */}
                          <div className="text-white text-right">
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">
                              {card.destinationCode}
                            </div>
                            <div className="text-xs md:text-sm font-light opacity-80">
                              {card.destinationCity}
                            </div>
                            <div className="text-xs font-light opacity-60">
                              {card.destinationCountry}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-end justify-between">
                          {/* Points Badge - Bottom Left */}
                          <div className="bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium">
                
                          </div>
                          
                          {/* Search Button or Arrow - Bottom Right */}
                          <div>
                            {isSearchCard ? (
                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                                <button className="bg-white text-gray-900 px-2 lg:px-10 py-2 rounded-md font-semibold text-sm md:text-base shadow-lg">
                                  Search Flights
                                </button>
                              </div>
                            ) : (
                              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" style={{ transform: 'rotate(-6deg)' }} viewBox="0 0 24 24" fill="none">
                                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {destinationData.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  index === activeIndex 
                    ? 'bg-[#3B82F6] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularDestinationsSlider;
