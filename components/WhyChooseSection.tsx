import React from 'react';
import Image from 'next/image';

const WhyChooseSection = () => {
  return (
    <section className="relative w-full py-20 px-6 sm:px-12 lg:px-20 text-white overflow-hidden pt-32 pb-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/about/plane_bg.jpg"
          alt="Aircraft background"
          fill
          className="object-cover animate-[zoom_20s_ease-in-out_infinite_alternate]"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Black Overlay */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-20 max-w-[90%] lg:max-w-[80%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-12 xl:gap-x-20 items-center">
          
          {/* Left Column - Text Content */}
          <div className="space-y-6 animate-[fadeInLeft_1s_ease-out]">
            {/* Top Line */}
            <div className="text-xs font-bold uppercase tracking-wide text-white/80 mb-3 animate-[fadeIn_0.8s_ease-out]">
              WHY CHOOSE SOARFARE
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold tracking-wide text-white mb-6 animate-[fadeInUp_1.2s_ease-out_0.2s_both]">
              Let SoarFare Guide Your Next Great Escape
            </h2>

            {/* Paragraph */}
            <p className="text-base md:text-lg leading-relaxed max-w-[520px] mb-10 text-white/90 font-thin pt-6 pb-6 animate-[fadeInUp_1.2s_ease-out_0.4s_both]">
              Whether you're a new traveler, or an experienced world wanderer, we want to help make 
              it easier for you to get there. We want to offer more ways to book flights, so you decide 
              which option is best for you, instead of a one size fits all booking!
            </p>

            {/* Checklist */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 animate-[fadeInLeft_1.2s_ease-out_0.6s_both] hover:translate-x-2 transition-transform duration-300">
                <div className="flex-shrink-0">
                  <Image
                    src="/checkbox.svg"
                    alt="Check"
                    width={24}
                    height={24}
                    className="w-10 h-10 filter brightness-0 invert"
                  />
                </div>
                <span className="font-thin text-lg text-white">
                  Breaks Up Your Flight Cost
                </span>
              </div>

              <div className="flex items-center gap-3 animate-[fadeInLeft_1.2s_ease-out_0.8s_both] hover:translate-x-2 transition-transform duration-300">
                <div className="flex-shrink-0">
                  <Image
                    src="/checkbox.svg"
                    alt="Check"
                    width={24}
                    height={24}
                    className="w-10 h-10 filter brightness-0 invert"
                  />
                </div>
                <span className="font-thin text-lg text-white">
                  Helps You Plan For Trips
                </span>
              </div>

              <div className="flex items-center gap-3 animate-[fadeInLeft_1.2s_ease-out_1s_both] hover:translate-x-2 transition-transform duration-300">
                <div className="flex-shrink-0">
                  <Image
                    src="/checkbox.svg"
                    alt="Check"
                    width={24}
                    height={24}
                    className="w-10 h-10 filter brightness-0 invert"
                  />
                </div>
                <span className="font-thin text-lg text-white">
                  Book Flights Your Way!
                </span>
              </div>

              <div className="flex items-center gap-3 animate-[fadeInLeft_1.2s_ease-out_1.2s_both] hover:translate-x-2 transition-transform duration-300">
                <div className="flex-shrink-0">
                  <Image
                    src="/checkbox.svg"
                    alt="Check"
                    width={24}
                    height={24}
                    className="w-10 h-10 filter brightness-0 invert"
                  />
                </div>
                <span className="font-thin text-lg text-white">
                  Share The World
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Images Grid */}
          <div className="w-full animate-[fadeInRight_1s_ease-out_0.4s_both]">
            <div className="grid grid-cols-2 gap-4">
              {/* First Row - 1 image on the right */}
              <div className="col-span-1"></div>
              <div className="relative animate-[fadeInUp_1.2s_ease-out_0.6s_both] hover:scale-105 transition-transform duration-500 hover:z-10">
                <Image
                  src="/about/travel1.jpg"
                  alt="Beautiful destination 1"
                  width={300}
                  height={200}
                  className="rounded-xl object-cover w-full h-[120px] sm:h-[150px] lg:h-[180px] shadow-lg hover:shadow-2xl transition-shadow duration-500"
                />
              </div>

              {/* Second Row - 2 images left and right */}
              <div className="relative animate-[fadeInUp_1.2s_ease-out_0.8s_both] hover:scale-105 transition-transform duration-500 hover:z-10">
                <Image
                  src="/about/travel2.jpg"
                  alt="Beautiful destination 2"
                  width={300}
                  height={200}
                  className="rounded-xl object-cover w-full h-[120px] sm:h-[150px] lg:h-[180px] shadow-lg hover:shadow-2xl transition-shadow duration-500"
                />
              </div>
              <div className="relative animate-[fadeInUp_1.2s_ease-out_1s_both] hover:scale-105 transition-transform duration-500 hover:z-10">
                <Image
                  src="/about/travel3.jpg"
                  alt="Beautiful destination 3"
                  width={300}
                  height={200}
                  className="rounded-xl object-cover w-full h-[120px] sm:h-[150px] lg:h-[180px] shadow-lg hover:shadow-2xl transition-shadow duration-500"
                />
              </div>

              {/* Third Row - 2 images left and right */}
              <div className="relative animate-[fadeInUp_1.2s_ease-out_1.2s_both] hover:scale-105 transition-transform duration-500 hover:z-10">
                <Image
                  src="/about/travel4.jpg"
                  alt="Beautiful destination 4"
                  width={300}
                  height={200}
                  className="rounded-xl object-cover w-full h-[120px] sm:h-[150px] lg:h-[180px] shadow-lg hover:shadow-2xl transition-shadow duration-500"
                />
              </div>
              <div className="relative animate-[fadeInUp_1.2s_ease-out_1.4s_both] hover:scale-105 transition-transform duration-500 hover:z-10">
                <Image
                  src="/about/travel5.jpg"
                  alt="Beautiful destination 5"
                  width={300}
                  height={200}
                  className="rounded-xl object-cover w-full h-[120px] sm:h-[150px] lg:h-[180px] shadow-lg hover:shadow-2xl transition-shadow duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
