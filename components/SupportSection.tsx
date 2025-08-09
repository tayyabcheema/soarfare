import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface SupportSectionProps {
  className?: string;
}

const SupportSection: React.FC<SupportSectionProps> = ({ className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section className={`w-full bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-[#0C2442]"
        >
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0C2442] leading-tight mb-6">
              Support
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              SoarFare is great for those that love to travel to always be<br />
              building up points for the next great adventure!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* LEFT COLUMN: Info Panel */}
            <motion.div variants={leftColumnVariants} className="space-y-6">
              {/* Section Header */}
              <div>
                <motion.p 
                  variants={itemVariants}
                  className="text-sm font-semibold text-[#FD7300] uppercase mb-3"
                >
                  GET IN TOUCH
                </motion.p>
                <motion.h2 
                  variants={itemVariants}
                  className="text-2xl md:text-3xl font-bold mb-3 text-[#0C2442]"
                >
                  Facing issues or want to know something?
                </motion.h2>
                <motion.div variants={itemVariants}>
                  <p className="text-sm leading-6 text-gray-500 mb-2">
                    We are here to answer any question you might have or resolve any issue you are facing, just fill out the form or send us email and we will do our best to help you out there!
                  </p>
                  <p className="font-semibold text-[#0C2442] text-sm">Happy Travels!</p>
                </motion.div>
              </div>

              {/* Contact Info Boxes */}
              <div className="space-y-4">
                {/* Email */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-4 border rounded-xl px-4 py-4 border-[#FD7300]"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[#FD7300] text-white rounded-full">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0C2442]">E-Mail Address:</p>
                    <p className="text-sm text-[#0C2442]">contact@soarfare.com</p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-4 border rounded-xl px-4 py-4 border-[#FD7300]"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[#FD7300] text-white rounded-full">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0C2442]">Phone Number:</p>
                    <p className="text-sm text-[#0C2442]">+123 456 78894 459</p>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-4 border rounded-xl px-4 py-4 border-[#FD7300]"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[#FD7300] text-white rounded-full">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0C2442]">Address:</p>
                    <p className="text-sm text-[#0C2442]">67B Gregorio Grove ,Jaskolskiville</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Contact Form */}
            <motion.div 
              variants={rightColumnVariants}
              className="rounded-2xl border border-[#FD7300] p-6 md:p-10"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-[#F6F8FB] w-full rounded-xl px-4 py-3 text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-[#FD7300] focus:outline-none transition-all duration-200"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-[#F6F8FB] w-full rounded-xl px-4 py-3 text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-[#FD7300] focus:outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#F6F8FB] w-full rounded-xl px-4 py-3 text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-[#FD7300] focus:outline-none transition-all duration-200"
                  required
                />

                {/* Subject */}
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-[#F6F8FB] w-full rounded-xl px-4 py-3 text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-[#FD7300] focus:outline-none transition-all duration-200"
                  required
                />

                {/* Message */}
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-[#F6F8FB] w-full rounded-xl px-4 py-3 text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-[#FD7300] focus:outline-none transition-all duration-200 resize-none"
                  required
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[#FD7300] text-white font-medium px-6 py-3 rounded-md hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SupportSection;
