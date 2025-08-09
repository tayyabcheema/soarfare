'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const [email, setEmail] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter submission
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  return (
    <footer className={`relative w-full ${className}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/footer_bg.jpg"
          alt="Footer background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0B2444] bg-opacity-95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="w-[90%] lg:w-[80%] mx-auto py-16">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Newsletter Section */}
            <motion.div 
              variants={itemVariants}
              className="mb-12 pb-12 border-b border-white/30"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Newsletter Content */}
                <div className="flex-1">
                  <p className="text-[#F27709] text-sm md:text-base font-bold uppercase mb-4 tracking-wide">
                    NEWSLETTER
                  </p>
                  <h3 className="text-2xl md:text-4xl font-thin text-white leading-tight">
                    Get your weekly travel guide
                  </h3>
                </div>

                {/* Newsletter Form */}
                <div className="flex-shrink-0 lg:ml-8">
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email here..."
                      className="px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-[#F27709] min-w-[280px]"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#F27709] text-white font-semibold rounded-lg hover:bg-[#E66900] transition-colors duration-200 whitespace-nowrap"
                    >
                      Subscribe Now
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Footer Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Logo & Description Column */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                {/* Logo */}
                <div className="mb-6">
                  <Image
                    src="/logo.png"
                    alt="SoarFare Logo"
                    width={150}
                    height={60}
                    className="h-auto w-auto max-w-[150px]"
                    priority
                  />
                </div>

                {/* Description */}
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
                  We create flexible travel solutions that help people plan ahead, save better, and connect meaningfully with the world.
                </p>

                {/* Social Icons */}
                <div className="flex items-center space-x-4">
                  {[
                    { name: 'Facebook', icon: '/fb.svg' },
                    { name: 'Twitter/X', icon: '/x.svg' },
                    { name: 'Instagram', icon: '/insta.svg' },
                    { name: 'TikTok', icon: '/tiktok.svg' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                      aria-label={social.name}
                    >
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={20}
                        height={20}
                        className="w-10 h-10"
                      />
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links Column */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white text-lg font-bold mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'About Us', href: '/about' },
                    { name: 'Subscriptions', href: '/subscription-plans' },
                    { name: 'FAQs', href: '/faq' },
                    { name: 'Privacy Policy', href: '/privacy-policy' }
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-white/80 hover:text-white transition-colors duration-200 text-sm md:text-base"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Official Info Column */}
              <motion.div variants={itemVariants}>
                <h4 className="text-white text-lg font-bold mb-6">Official Info</h4>
                <ul className="space-y-4">
                  {/* Location */}
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <svg className="w-5 h-5 text-[#F27709]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Location:</p>
                      <p className="text-white/80 text-sm">Riverton, Utah, USA</p>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <svg className="w-5 h-5 text-[#F27709]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Email:</p>
                      <a
                        href="mailto:info@soarfare.com"
                        className="text-white/80 text-sm hover:text-white transition-colors duration-200"
                      >
                        info@soarfare.com
                      </a>
                    </div>
                  </li>

                  {/* Phone */}
                  {/* <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <svg className="w-5 h-5 text-[#F27709]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Phone:</p>
                      <a
                        href="tel:+011234567895"
                        className="text-white/80 text-sm hover:text-white transition-colors duration-200"
                      >
                        (+01) 1234567895
                      </a>
                    </div>
                  </li> */}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
