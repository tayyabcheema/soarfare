import React from 'react';
import Image from 'next/image';

const WhyChooseSoarFareSection = () => {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            {/* Subheading */}
            <div className="flex items-center">
              <span className="text-blue-300 text-md md:text-base font-medium tracking-wide">
                Why Choose SoarFare
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-loose tracking-wide">
              We Recommend Beautiful<br />
              Destination Every Month
            </h2>

            {/* Paragraph */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
              Experiencing the world doesn't have to wait for the perfect moment—or the perfect 
              budget. SoarFare helps real people plan real trips: with flexible subscriptions, 
              rewards, and support every step of the way! Join a community of travelers who are 
              getting there, together.
            </p>

            {/* Bullet Points */}
            <div className="space-y-6 md:space-y-8 pt-4 lg:pr-20">
              {/* Bullet Point 1 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mt-1">
                  <Image
                    src="/checkbox.svg"
                    alt="Check"
                    width={58}
                    height={58}
                    className="w-16 h-16"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    Travel on Your Terms
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Whether you're planning a quick weekend getaway or a long-haul adventure, 
                    SoarFare adapts to your timeline and goals—no rigid rules, no expiration dates.
                  </p>
                </div>
              </div>

              {/* Bullet Point 2 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mt-1">
                  <Image
                    src="/checkbox.svg"
                    alt="Check"
                    width={24}
                    height={24}
                    className="w-16 h-16"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    Flexible Solutions
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Sign up in minutes, track your progress, and book when you're ready.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Video Thumbnail */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative w-full aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden shadow-lg mt-20">
              <Image
                src="/video_promo.jpg"
                alt="Travel destination video"
                fill
                className="object-cover"
                priority
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="group bg-black/60 hover:bg-black/80 transition-all duration-300 rounded-full p-6 lg:p-8 shadow-2xl transform hover:scale-110"
                  aria-label="Play video"
                >
                  <div className="w-0 h-0 border-l-[20px] lg:border-l-[28px] border-r-0 border-t-[12px] lg:border-t-[16px] border-b-[12px] lg:border-b-[16px] border-l-white border-t-transparent border-b-transparent ml-2"></div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseSoarFareSection;
