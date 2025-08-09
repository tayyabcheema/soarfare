import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQPageSectionProps {
  className?: string;
}

const FAQPageSection: React.FC<FAQPageSectionProps> = ({ className = "" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('General');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const tabs = ['General', 'My Dashboard', 'Ticket Booking', 'Altitude Rewards'];

  const faqData: FAQItem[] = [
    // General FAQs
    {
      id: 1,
      category: 'General',
      question: "What Is SoarFare?",
      answer: "SoarFare is a travel savings platform that helps you build up flight credit over time, making it easier to afford your dream trips. We offer flexible subscription plans that let you save toward flights at your own pace."
    },
    {
      id: 2,
      category: 'General',
      question: "Can I Lower, Freeze, Or Increase My Subscription?",
      answer: "Yes! At any time you can make changes to your subscription level with SoarFare. So, if you decide to take a large trip mid-year, you can increase your subscription to help you boost your points before then."
    },
    {
      id: 3,
      category: 'General',
      question: "Can I Transfer My SoarFare Points To A Friend?",
      answer: "Currently, SoarFare points are non-transferable and tied to your individual account. However, you can help family members set up their own accounts to start earning their own travel credits."
    },
    {
      id: 4,
      category: 'General',
      question: "Can I Trade My Points For Money?",
      answer: "SoarFare points are designed specifically for flight bookings and cannot be converted to cash. This helps us maintain lower costs and better value for your travel savings."
    },
    {
      id: 5,
      category: 'General',
      question: "How Do I Know Which Subscription Level Is Right For Me?",
      answer: "Consider your travel frequency and budget. The Basic plan works great for occasional travelers, Standard is perfect for regular trips, and Premium is ideal for frequent flyers who want to maximize their savings potential."
    },
    {
      id: 6,
      category: 'General',
      question: "Can I Get Points For My Entire Family?",
      answer: "Each family member needs their own SoarFare account to earn and use points. This ensures personalized travel preferences and individual reward tracking for everyone."
    },
    {
      id: 7,
      category: 'General',
      question: "Do My Points Expire?",
      answer: "No! Your SoarFare points never expire as long as your account remains active. You can take your time saving up for that perfect trip without worrying about losing your progress."
    },

    // My Dashboard FAQs
    {
      id: 8,
      category: 'My Dashboard',
      question: "How Do I Get A SoarFare Dashboard?",
      answer: "Simply sign up on our platform and you'll get access to your personalized SoarFare dashboard instantly. Your dashboard is your central hub for tracking savings, booking flights, and managing your account."
    },
    {
      id: 9,
      category: 'My Dashboard',
      question: "Can I Upload A Picture To My Dashboard?",
      answer: "Yes! You can personalize your dashboard with profile photos and travel highlights. This helps make your travel planning experience more personal and engaging."
    },
    {
      id: 10,
      category: 'My Dashboard',
      question: "What If I Need A Receipt For My Subscription?",
      answer: "Receipts are automatically emailed to you after each payment, and are also available in your billing section inside the dashboard. You can download and print them anytime for your records."
    },
    {
      id: 11,
      category: 'My Dashboard',
      question: "Can I Track My Savings Progress?",
      answer: "Absolutely! Your dashboard shows real-time progress toward your travel goals, including total points earned, subscription history, and projected savings timeline."
    },

    // Ticket Booking FAQs
    {
      id: 12,
      category: 'Ticket Booking',
      question: "Can I book a flight from my user Dashboard?",
      answer: "Absolutely! You can search, compare, and book flights directly from your SoarFare dashboard using your accumulated points and credits."
    },
    {
      id: 13,
      category: 'Ticket Booking',
      question: "What Airlines Can I Book With SoarFare?",
      answer: "SoarFare works with major airlines worldwide, giving you access to thousands of flight options. We partner with both domestic and international carriers to provide maximum flexibility."
    },
    {
      id: 14,
      category: 'Ticket Booking',
      question: "Can I Book Flights For Others Using My Points?",
      answer: "Yes! You can use your SoarFare points to book flights for family members and friends. Just make sure to enter their correct information during the booking process."
    },

    // Altitude Rewards FAQs
    {
      id: 15,
      category: 'Altitude Rewards',
      question: "What Are Altitude Rewards?",
      answer: "Altitude Rewards are bonus points you earn on top of your subscription credits. You get rewards for consistent saving, referrals, and special promotions throughout the year."
    },
    {
      id: 16,
      category: 'Altitude Rewards',
      question: "How Do I Earn More Altitude Rewards?",
      answer: "Stay consistent with your subscription, refer friends to SoarFare, participate in seasonal promotions, and engage with our travel community to earn bonus Altitude Rewards."
    },
    {
      id: 17,
      category: 'Altitude Rewards',
      question: "Do Altitude Rewards Expire?",
      answer: "Like your main SoarFare points, Altitude Rewards never expire as long as your account remains active. All your rewards roll over and accumulate over time."
    }
  ];

  const filteredFAQs = faqData.filter(faq => faq.category === activeTab);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setOpenIndex(null); // Close any open FAQ when switching tabs
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
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab}
                  variants={tabVariants}
                  onClick={() => handleTabChange(tab)}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? 'bg-white text-gray-800 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div 
            variants={containerVariants}
            className="mx-auto"
            key={activeTab} // Force re-render when tab changes
          >
            {filteredFAQs.map((faq, index) => (
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
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQPageSection;
