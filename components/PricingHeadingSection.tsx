import React from 'react';

const PricingHeadingSection = () => {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="w-[90%] lg:w-[80%] mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0C2442] leading-relaxed tracking-wider mb-6 animate-[fadeInUp_1s_ease-out]">
          Choose a plan<br />
          that works for you
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-[fadeInUp_1.2s_ease-out_0.2s_both]">
          SoarFare is great for those that love to travel to always be building up<br />
          points for the next great adventure!
        </p>
      </div>
    </section>
  );
};

export default PricingHeadingSection;
