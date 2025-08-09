import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

interface PlanAheadSectionProps {
  subtitle?: string;
  heading: string[];
  buttonText?: string;
  backgroundImage: string;
  onButtonClick?: () => void;
  className?: string;
  reverseOrder?: boolean; // New prop to reverse heading and subtitle order
  subtitleWeight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold'; // New prop for subtitle font weight
}

const PlanAheadSection: React.FC<PlanAheadSectionProps> = ({
  subtitle = "Can't Decide Where To Go?",
  heading,
  buttonText = "Join SoarFare",
  backgroundImage,
  onButtonClick,
  className = "",
  reverseOrder = false, // Default to original order
  subtitleWeight = 'medium' // Default font weight
}) => {
  // Helper function to get font weight class
  const getFontWeightClass = (weight: string) => {
    const weightMap = {
      'thin': 'font-thin',
      'light': 'font-light',
      'normal': 'font-normal',
      'medium': 'font-medium',
      'semibold': 'font-semibold',
      'bold': 'font-bold'
    };
    return weightMap[weight as keyof typeof weightMap] || 'font-medium';
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
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

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className={`w-full py-12 md:py-16 lg:py-12 ${className}`}>
      <div className="w-[90%] lg:w-[80%] mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative h-[400px] md:h-[500px] lg:h-[650px] rounded-3xl overflow-hidden"
        >
          {/* Background Image */}
            <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="Plan ahead section background"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
            />
            {/* Stronger black overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
            </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="w-full max-w-2xl px-8 md:px-12 lg:px-16">
              
              {!reverseOrder ? (
                <>
                  {/* Original Order: Subtitle first, then Heading */}
                  <motion.p 
                    variants={textVariants}
                    className={`text-white/70 text-lg md:text-xl ${getFontWeightClass(subtitleWeight)} mb-6`}
                  >
                    {subtitle}
                  </motion.p>
                  
                  <motion.div
                    variants={textVariants}
                    className="mb-8 md:mb-8"
                  >
                    {heading.map((line, index) => (
                      <h1 
                        key={index}
                        className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight"
                      >
                        {line}
                      </h1>
                    ))}
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Reversed Order: Heading first, then Subtitle */}
                  <motion.div
                    variants={textVariants}
                    className="mb-6 md:mb-8"
                  >
                    {heading.map((line, index) => (
                      <h1 
                        key={index}
                        className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight"
                      >
                        {line}
                      </h1>
                    ))}
                  </motion.div>

                  <motion.p 
                    variants={textVariants}
                    className={`text-white/70 text-lg md:text-xl ${getFontWeightClass(subtitleWeight)} mb-8`}
                  >
                    {subtitle}
                  </motion.p>
                </>
              )}

              {/* Button */}
              <motion.button
                variants={buttonVariants}
                onClick={onButtonClick}
                className="bg-orange hover:bg-opacity-90 text-white font-bold lg:px-12 px-6 lg:py-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-base md:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {buttonText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlanAheadSection;
