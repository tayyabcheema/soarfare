import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: '/header1.jpg',
    heading: ['Plan', 'Ahead'],
    text: 'Take control of your travel goals with flexible monthly savings.'
  },
  {
    image: '/header1.jpg',
    heading: ['Save', 'Smart'],
    text: 'Automate your savings and reach your travel dreams faster.'
  },
  {
    image: '/header1.jpg',
    heading: ['Travel', 'Easy'],
    text: 'Enjoy hassle-free planning and exclusive deals.'
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500); // Half of the transition duration
    }, 5000); // Changed to 5 seconds for better UX

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[80vh] overflow-hidden">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <img
            src={slide.image}
            alt={slide.heading.join(' ')}
            className="w-full h-full object-cover brightness-[0.6]"
            style={{
              filter: 'brightness(0.6)',
            }}
          />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-start z-10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Heading */}
            <h1 
              className={`
                font-bold text-white leading-tight mb-4 sm:mb-6 md:mb-4
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                transform transition-all duration-700 ease-out
                ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
              `}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className="text-[#F27709]">{slides[current].heading[0]}</span>{' '}
              <span className="text-white">{slides[current].heading[1]}</span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`
                text-white font-normal leading-relaxed
                text-base sm:text-lg md:text-xl lg:text-2xl
                max-w-xl lg:max-w-2xl
                transform transition-all duration-700 ease-out delay-100
                ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
              `}
              style={{ fontFamily: 'Barlow, sans-serif' }}
            >
              {slides[current].text}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Blur Overlay for Section Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 md:h-48 lg:h-56 pointer-events-none">
        {/* Gradient overlay that fades from transparent to white */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        
        {/* Additional blur effect */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-white/30 via-white/10 to-transparent"></div>
        
        {/* Subtle shadow for depth */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
