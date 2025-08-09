import React from 'react';
import Image from 'next/image';

const JourneySection = () => {
  const checklistItems = [
    "Choose a destination you've always wanted to visit",
    "Set a savings goal for your trip",
    "Make regular contributions to your travel fund",
    "Watch your savings grow with rewards and bonuses",
    "Get notified when you've reached your goal",
    "Book your flight with confidence",
    "Pack your bags and enjoy your adventure!"
  ];

  const handlePlayVideo = () => {
    console.log('Play video clicked');
    // Handle video play functionality
  };

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="w-[90%] lg:w-[80%] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">
          
          {/* Left Column - Text Content */}
          <div className="flex-1 text-center md:text-left animate-[fadeInLeft_1s_ease-out]">
            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug text-[#0C2442] mb-8 animate-[fadeInUp_1.2s_ease-out_0.2s_both]">
              Your Journey Starts Here<br />
              Easy as Save, Book, Fly!
            </h2>

            {/* Checklist */}
            <ul className="space-y-4 max-w-lg mx-auto md:mx-0">
              {checklistItems.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-4 hover:translate-x-2 transition-transform duration-300"
                  style={{
                    animation: `fadeInLeft 1.2s ease-out ${0.4 + index * 0.1}s both`
                  }}
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-full shadow-sm flex-shrink-0 mt-0.5 ">
                    <Image
                      src="/checkbox.svg"
                      alt="Check"
                      width={16}
                      height={16}
                      className="w-12 h-12 transition-transform duration-300 hover:scale-110"
                      style={{ filter: 'invert(41%) sepia(94%) saturate(749%) hue-rotate(81deg) brightness(93%) contrast(92%)' }}
                    />
                  </div>
                  <span className="text-lg font-medium text-[#0C2442] text-left leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Image with Orange Background */}
          <div className="flex-1 flex justify-center mt-10 md:mt-0 animate-[fadeInRight_1s_ease-out_0.3s_both]">
            <div className="relative inline-block w-full max-w-md">
              {/* Orange Background Accent */}
              <div className="absolute -bottom-6 -right-6 w-full h-3/4 bg-[#FD7300] rounded-br-[20px] rounded-bl-[20px] z-0 animate-[fadeInUp_1.2s_ease-out_0.8s_both]"></div>
              
              {/* Main Image */}
              <div className="relative z-10 animate-[fadeInUp_1.2s_ease-out_0.6s_both] hover:scale-105 transition-transform duration-500">
                <Image
                  src="/video_promo.jpg"
                  alt="Journey starts here"
                  width={400}
                  height={300}
                  className="rounded-[30px] w-full h-auto object-cover shadow-lg hover:shadow-2xl transition-shadow duration-500"
                />
                
                {/* Play Button Overlay */}
                <button
                  onClick={handlePlayVideo}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           w-16 h-16 bg-white rounded-full flex items-center justify-center 
                           shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-125
                           group z-20 animate-[fadeIn_1.2s_ease-out_1s_both] hover:bg-gray-50"
                  aria-label="Play journey video"
                >
                  {/* Play Triangle Icon */}
                  <div className="w-0 h-0 border-l-[12px] border-r-0 border-t-[8px] border-b-[8px] 
                               border-l-[#FD7300] border-t-transparent border-b-transparent 
                               ml-1 group-hover:border-l-[#e55a00] transition-colors duration-300">
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
