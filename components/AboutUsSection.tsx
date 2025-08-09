import React from 'react';
import Image from 'next/image';

const AboutUsSection: React.FC = () => {
  return (
    <section className="bg-white w-full">
      <div className="w-[90%] lg:w-[80%] mx-auto py-16">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Heading */}
          <div className="text-center lg:text-center lg:mt-10">
            <h2 className="text-6xl lg:text-7xl font-bold text-[#0B2444] leading-tight">
              About Us
            </h2>
          </div>

          {/* Right Column - Paragraph */}
          <div className="flex justify-center lg:justify-start">
            <div className="max-w-[600px]">
              <p className="text-base md:text-lg text-[#0B2444] leading-relaxed text-center lg:text-left">
                At SoarFare, we believe travel should be simple, exciting, and accessible to 
                everyone. Whether you're planning your first adventure or your next one, we're 
                here to help you get there with ease. Our innovative points-based system lets 
                you save monthly and book flights your way—without the pressure of upfront 
                costs.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="mt-10 flex justify-center">
          <Image
            src="/about_line.svg"
            alt="Decorative travel line"
            width={1200}
            height={100}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
