import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface CounterProps {
  end: number;
  duration: number;
  suffix: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration, suffix }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        setCount(Math.floor(percentage * end));

        if (percentage < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="text-dark-blue text-4xl md:text-5xl font-bold font-poppins">
      {count}{suffix}
    </span>
  );
};

const Features: React.FC = () => {
  return (
    <section className="w-[90%] xl:w-[85%] 2xl:w-[80%] max-w-8xl mx-auto lg:px-4 py-16">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 xl:gap-20 2xl:gap-2 lg:pt-32 lg:pb-32">
        {/* Left side - Image with circular text */}
        <div className="relative w-full lg:w-[45%] xl:w-[40%] 2xl:w-[50%]">
          <div className="relative max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto lg:mx-0">
            {/* Circular text behind */}
            <div className="absolute lg:-right-10 -right-0 -top-10 w-32 h-32 animate-spin-slow z-0">
              <Image
                src="/text_circle.jpg"
                alt="See How It Works"
                width={80}
                height={80}
                className="w-full h-full"
              />
            </div>
            {/* Main image on top */}
            <Image
              src="/about.jpg"
              alt="Travelers enjoying their journey"
              width={600}
              height={450}
              className="w-full h-auto rounded-lg object-cover relative z-10"
              priority
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full lg:w-[55%] xl:w-[60%] 2xl:w-[50%] flex items-center">
          <div className="space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 max-w-xl xl:max-w-2xl mx-auto lg:mx-0 lg:pl-2 xl:pl-2">
            <div className="flex items-center gap-2 pt-10 lg:pt-0">
              <span className="text-xs md:text-sm uppercase tracking-wider text-gray-600 font-medium">
                Cleared for departure
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4rem] font-bold font-poppins leading-[40px] md:leading-[50px] lg:leading-[55px] xl:leading-[65px] 2xl:leading-[75px]">
              Discover the world with{' '}
              <span className="text-orange">SoarFare</span>
            </h2>
            
            <p className="text-gray-600 text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed max-w-lg xl:max-w-2xl" style={{ lineHeight: '30px' }}>
              No more waiting for the "right time" to travel. SoarFare helps you save now so you can 
              book when the moment feels right. No blackout dates, no gimmicks—just flexible travel, 
              your way.
            </p>

            {/* Stats */}
            <div className="flex gap-8 md:gap-16 xl:gap-20 py-6 md:py-8">
              <div>
                <Counter end={10} duration={2000} suffix="K+" />
                <p className="text-xs md:text-sm xl:text-base text-gray-500 mt-2">Worldwide Users</p>
              </div>
              <div>
                <Counter end={2500} duration={2000} suffix="+" />
                <p className="text-xs md:text-sm xl:text-base text-gray-500 mt-2">Total Flights</p>
              </div>
            </div>

            {/* CTA Button */}
            <button className="mt-6 bg-orange text-white px-8 py-3 xl:px-10 xl:py-4 text-sm md:text-base xl:text-lg rounded-md hover:bg-opacity-90 transition-colors duration-200 font-medium">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
