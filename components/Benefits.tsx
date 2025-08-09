import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface BenefitProps {
  number: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const benefits: BenefitProps[] = [
  {
    number: '01',
    title: 'Breaks Up Your Flight Cost',
    description: 'It\'s the simple solution to a simple problem! Break up those flight costs into more affordable payments, or always be building points so you can take that trip whenever you want!',
    bgColor: 'bg-[#0C2545]',
    textColor: 'text-white'
  },
  {
    number: '02',
    title: 'Book Flights Your Way!',
    description: 'We make it effortless and so easy for you to book flights in a way that makes the most sense to you! Be it through our Subscription or our Build Up programs to always be building towards a flight.',
    bgColor: 'bg-[#4CAF50]',
    textColor: 'text-white'
  },
  {
    number: '03',
    title: 'Helps You Plan For Trips',
    description: 'Planning on a trip that you need to save up for? Great! Pick the subscription that helps you get to your needed points 30-45 days before you plan on going!',
    bgColor: 'bg-white',
    textColor: 'text-gray-800'
  },
  {
    number: '04',
    title: 'Share The World',
    description: 'We allow you to share your points with anyone you want too, with no cost or required subscription for your travel buddy! All they need is a SoarFare Account.',
    bgColor: 'bg-[#F27709]',
    textColor: 'text-white'
  }
];

const Benefits = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400
  });

  // Animation sequences for each element
  // Plane leads the animation - smooth continuous movement
  const planeX = useTransform(smoothProgress, 
    [0, 1],  // Move across entire scroll duration
    ["-10%", "110%"]  // Start off-screen left, exit off-screen right
  );
  
  // Blue line follows behind the plane
  const pathWidth = useTransform(smoothProgress, 
    [0, 0.7],  // Grows as plane moves
    ["0%", "110%"]  // Grows to accommodate text
  );

  // Letter-by-letter animation for "OUR BENEFITS"
  const benefitsText = "OUR BENEFITS";
  const letters = benefitsText.split("");

  // Animation timings
  const mapX = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
  const contentX = useTransform(smoothProgress, [0.3, 0.8], ["0%", "-50%"]);
  const contentOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);
  const boxAnimationProgress = useTransform(smoothProgress, [0.4, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      {/* Main Container */}
      <div className="sticky top-0 w-full h-screen bg-[#111827] overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0">
          <motion.div
            className="relative w-[200%] h-full"
            style={{ x: mapX }}
          >
            <Image
              src="/map.webp"
              alt="World Map Background"
              fill
              className="object-cover scale-120"
              priority
            />
          </motion.div>
        </div>

        {/* Content Container - Benefits Cards */}
        <div ref={contentRef} className="relative h-full z-10 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Positioned benefit cards around the center line */}
            <div className="relative">
              {/* Card 01 - Top Left (Blue) */}
              <motion.div
                className={`absolute ${benefits[0].bgColor} ${benefits[0].textColor} rounded-2xl p-6 shadow-2xl`}
                style={{ 
                  top: '-300px',
                  left: '200px',
                  width: '650px',
                  height: '200px',
                  opacity: useTransform(smoothProgress, [0.2, 0.3], [0, 1]),
                  scale: useTransform(smoothProgress, [0.2, 0.3], [0.8, 1]),
                  y: useTransform(smoothProgress, [0.2, 0.3], [30, 0])
                }}
              >
                <span className="text-3xl font-bold mb-4 block">
                  {benefits[0].number}
                </span>
                <h3 className="text-xl font-bold mb-3">{benefits[0].title}</h3>
                <p className="text-sm leading-relaxed">{benefits[0].description}</p>
              </motion.div>

              {/* Card 02 - Bottom Left (Green) */}
              <motion.div
                className={`absolute ${benefits[1].bgColor} ${benefits[1].textColor} rounded-2xl p-8 shadow-2xl`}
                style={{ 
                  top: '165px',
                  left: '400px',
                  width: '350px',
                  height: '280px',
                  opacity: useTransform(smoothProgress, [0.3, 0.4], [0, 1]),
                  scale: useTransform(smoothProgress, [0.3, 0.4], [0.8, 1]),
                  y: useTransform(smoothProgress, [0.3, 0.4], [30, 0])
                }}
              >
                <span className="text-3xl font-bold mb-4 block">
                  {benefits[1].number}
                </span>
                <h3 className="text-xl font-bold mb-3">{benefits[1].title}</h3>
                <p className="text-sm leading-relaxed">{benefits[1].description}</p>
              </motion.div>

              {/* Card 03 - Top Right (White) */}
              <motion.div
                className={`absolute ${benefits[2].bgColor} ${benefits[2].textColor} rounded-2xl p-8 shadow-2xl`}
                style={{ 
                  top: '-350px',
                  right: '-200px',
                  width: '350px',
                  height: '280px',
                  opacity: useTransform(smoothProgress, [0.45, 0.6], [0, 1]),
                  scale: useTransform(smoothProgress, [0.45, 0.6], [0.8, 1]),
                  y: useTransform(smoothProgress, [0.5, 0.6], [30, 0])
                }}
              >
                <span className="text-3xl font-bold mb-4 block">
                  {benefits[2].number}
                </span>
                <h3 className="text-xl font-bold mb-3">{benefits[2].title}</h3>
                <p className="text-sm leading-relaxed">{benefits[2].description}</p>
              </motion.div>

              {/* Card 04 - Bottom Right (Orange) */}
              <motion.div
                className={`absolute ${benefits[3].bgColor} ${benefits[3].textColor} rounded-2xl p-8 shadow-2xl`}
                style={{ 
                  top: '150px',
                  right: '-250px',
                  width: '550px',
                  height: '220px',
                  opacity: useTransform(smoothProgress, [0.5, 0.7], [0, 1]),
                  scale: useTransform(smoothProgress, [0.5, 0.7], [0.8, 1]),
                  y: useTransform(smoothProgress, [0.6, 0.7], [30, 0])
                }}
              >
                <span className="text-3xl font-bold mb-4 block">
                  {benefits[3].number}
                </span>
                <h3 className="text-xl font-bold mb-3">{benefits[3].title}</h3>
                <p className="text-sm leading-relaxed">{benefits[3].description}</p>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Airplane and Line Animation */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="w-full h-24 relative">
            {/* Blue line with gradient */}
            <motion.div 
              className="h-40 bg-blue-300 rounded-r-xl relative"
              style={{ width: pathWidth }}
            >
              {/* Our Benefits Text - Letter by Letter Animation */}
              <motion.div 
                className="absolute left-12 top-1/2 -translate-y-1/2"
              >
                <h2 className="text-7xl font-bold text-black pt-2 flex">
                  {letters.map((letter, index) => (
                    <motion.span
                      key={index}
                      style={{
                        display: letter === ' ' ? 'inline-block' : 'inline',
                        width: letter === ' ' ? '0.3em' : 'auto',
                        opacity: useTransform(
                          smoothProgress,
                          [0.1 + (index * 0.02), 0.15 + (index * 0.02)],
                          [0, 1]
                        )
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </h2>
              </motion.div>

              {/* Airplane - positioned at the end of the blue line */}
              <motion.div
                className="absolute top-2 right-0 z-30"
                style={{
                  x: "-10px", // Small offset to the right of the line end
                  scale: 2,
                  minWidth: "300px", // Ensures airplane container doesn't get compressed
                  display: "flex",
                  justifyContent: "flex-end" // Keeps airplane at the right edge
                }}
              >
                <Image
                  src="/aeroplane.png"
                  alt="Airplane"
                  width={150}
                  height={120}
                  className="transform"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
