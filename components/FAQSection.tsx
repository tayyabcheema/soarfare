import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

import apiClient from '../lib/api';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category_id: number;
}

interface FAQSectionProps {
  className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ className = "" }) => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.request('/faqs', { method: 'GET' });
        if (res.success && res.data) {
          // Find the 'General' category id
          const generalCategory = (res.data.faq_categories || []).find((cat: any) => cat.name.toLowerCase() === 'general');
          if (generalCategory) {
            const generalFaqs = (res.data.faqs || []).filter((faq: any) => faq.category_id === generalCategory.id);
            setFaqs(generalFaqs);
          } else {
            setFaqs([]);
          }
        } else {
          setError(res.message || 'Failed to load FAQs');
        }
      } catch (err) {
        setError('Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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

  const titleVariants = {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className={`w-full bg-white py-8 md:py-20 lg:py-8 lg:px-8 ${className}`}>
      <div className="w-[90%] lg:w-[80%] mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <motion.p 
              variants={titleVariants}
              className="text-blue-300 text-sm md:text-base font-normal mb-4"
            >
              FAQ's
            </motion.p>
            
            <motion.h2 
              variants={titleVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0C2340] leading-tight"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>

          {/* FAQ Items */}
          <div className="mx-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading FAQs...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No FAQs found.</div>
            ) : (
              faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  {/* Question Row */}
                  <button
                    onClick={() => handleToggle(index)}
                    className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                  >
                    {/* Question Text */}
                    <h3 className="text-lg md:text-xl font-normal text-[#0C2340] pr-4">
                      {faq.question}
                    </h3>
                    {/* Toggle Icon */}
                    <div className="flex-shrink-0">
                      <div className="bg-gray-200 rounded-full p-2 transition-colors duration-200 group-hover:bg-gray-300">
                        {openIndex === index ? (
                          // Minus Icon
                          <svg 
                            className="w-5 h-5 text-gray-600 transition-transform duration-200" 
                            viewBox="0 0 24 24" 
                            fill="none"
                          >
                            <path 
                              d="M5 12h14" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          // Plus Icon
                          <svg 
                            className="w-5 h-5 text-gray-600 transition-transform duration-200" 
                            viewBox="0 0 24 24" 
                            fill="none"
                          >
                            <path 
                              d="M12 5v14m-7-7h14" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                  {/* Answer - Animated Accordion */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                    }`}
                  >
                    <div className="pr-12">
                      <p className="text-[#6B7280] text-base leading-relaxed font-normal">
                        <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
