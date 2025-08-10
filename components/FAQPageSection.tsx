import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import apiClient from '../lib/api';


interface FAQCategory {
  id: number;
  name: string;
  slug: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category_id: number;
}

interface FAQPageSectionProps {
  className?: string;
}

const FAQPageSection: React.FC<FAQPageSectionProps> = ({ className = "" }) => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
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
          setCategories(res.data.faq_categories || []);
          setFaqs(res.data.faqs || []);
          if (res.data.faq_categories && res.data.faq_categories.length > 0) {
            setActiveTab(res.data.faq_categories[0].id);
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

  const filteredFAQs = faqs.filter(faq => faq.category_id === activeTab);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    setOpenIndex(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
        stiffness: 100
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
        stiffness: 100
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <section className={`w-full bg-white py-16 md:py-20 lg:py-24 ${className}`}>
      <div className="w-[90%] lg:w-[80%] mx-auto px-3">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-full mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <motion.h1 
              variants={titleVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0C2442] leading-tight mb-6"
            >
              FAQ's
            </motion.h1>
            
            <motion.p 
              variants={titleVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              SoarFare is great for those that love to travel to always be building up<br />
              points for the next great adventure!
            </motion.p>
          </div>

          {/* Tab Navigation */}
          <motion.div 
            variants={containerVariants}
            className="flex justify-center mb-12 px-4 overflow-x-auto"
          >
            <div className="inline-flex bg-orange rounded-full p-1 gap-1 min-w-max">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  variants={tabVariants}
                  onClick={() => handleTabChange(cat.id)}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeTab === cat.id
                      ? 'bg-white text-gray-800 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div 
            variants={containerVariants}
            className="mx-auto"
            key={activeTab}
          >
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading FAQs...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No FAQs found for this category.</div>
            ) : (
              filteredFAQs.map((faq, index) => (
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
                    <h3 className="text-lg md:text-xl font-normal text-[#0C2442] pr-4">
                      {faq.question}
                    </h3>
                    {/* Toggle Icon */}
                    <div className="flex-shrink-0">
                      <div className="bg-gray-200 rounded-full p-2 transition-colors duration-200 group-hover:bg-orange group-hover:text-white">
                        {openIndex === index ? (
                          // Minus Icon
                          <svg 
                            className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" 
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
                            className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" 
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
                      <p className="text-gray-600 text-base leading-relaxed">
                        {/* Render HTML answer if present */}
                        <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQPageSection;
