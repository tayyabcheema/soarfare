import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { apiClient } from '../lib/api';
import { SubscriptionTier } from '../types/subscription';

interface PricingPlan {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  icon: string;
  features: string[];
  isPopular?: boolean;
}

interface PricingSectionProps {
  showHeading?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ showHeading = true }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef(null);
  const cardsRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-100px" });
  const isCardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  // Fetch subscription plans from backend
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await apiClient.getSubscriptionPlans();
        if (response.success && response.data?.packages) {
          setSubscriptionPlans(response.data.packages);
        } else {
          setError('Failed to fetch subscription plans');
        }
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  // Transform backend data to frontend format
  const transformPlanData = (tier: SubscriptionTier): PricingPlan => {
    const features = [
      `${tier.points} Elevation Rewards points per month`,
      `${tier.regional} Regional flights included`,
      tier.continental > 0 ? `${tier.continental} Continental flights included` : null,
      tier.international > 0 ? `${tier.international} International flights included` : null,
      'Access to all SoarFare features',
      'Pause or cancel anytime'
    ].filter(Boolean) as string[];

    return {
      id: tier.id.toString(),
      title: tier.title,
      subtitle: `Perfect for ${tier.title.toLowerCase()}s`,
      price: `$${tier.price}`,
      icon: getIconForTier(tier.id),
      features,
      isPopular: tier.id === 2 // Standard plan is popular
    };
  };

  const getIconForTier = (tierId: number): string => {
    const iconMap: { [key: number]: string } = {
      1: '/price1.svg', // Basic
      2: '/price2.svg', // Standard
      4: '/price3.svg', // Premium
    };
    return iconMap[tierId] || '/price1.svg';
  };

  const pricingPlans: PricingPlan[] = subscriptionPlans.map(transformPlanData);

  const getCardStyle = (planId: string, isPopular: boolean) => {
    if (hoveredCard === null) {
      return isPopular 
        ? 'bg-orange text-white transform transition-all duration-200 ease-out' 
        : 'bg-white text-gray-900 border border-gray-200 transform transition-all duration-200 ease-out';
    }
    
    if (hoveredCard === planId) {
      return 'bg-orange text-white transform transition-all duration-200 ease-out';
    }
    
    return 'bg-white text-gray-900 border border-gray-200 transform transition-all duration-200 ease-out';
  };

  const getButtonStyle = (planId: string, isPopular: boolean) => {
    const isHighlighted = hoveredCard === planId || (hoveredCard === null && isPopular);
    return isHighlighted 
      ? 'bg-white text-orange hover:bg-gray-50 transform transition-all duration-150 ease-out' 
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 transform transition-all duration-150 ease-out';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.00,
      y: -2,
      transition: {
        duration: 0.1,
        type: "spring" as const,
        stiffness: 800,
        damping: 15
      }
    },
    tap: {
      scale: 0.95,
      y: 0
    }
  };

  return (
    <section className="w-full bg-gray-50 py-16 md:py-20 lg:py-20">
      <div className="w-[90%] lg:w-[85%] xl:w-[80%] max-w-8xl mx-auto px-0 sm:px-16 ">
        {showHeading && (
          <motion.div
            ref={headingRef}
            variants={containerVariants}
            initial="hidden"
            animate={isHeadingInView ? "visible" : "hidden"}
            className="text-center mb-12 lg:mb-16"
          >
            {/* Small heading */}
            <motion.p 
              variants={cardVariants}
              className="text-gray-600 text-sm md:text-base uppercase lg:tracking-wider font-medium mb-4"
            >
              Soar Your Way
            </motion.p>
            
            {/* Main heading */}
            <motion.h2 
              variants={cardVariants}
              className="text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-[#0C2340] lg:leading-loose tracking-wide mb-6"
            >
              Your Next Adventure Starts Here
            </motion.h2>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          initial="hidden"
          animate={isCardsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-8 "
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-12 bg-gray-200 rounded mb-8"></div>
                <div className="h-10 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : pricingPlans.length === 0 ? (
            // No plans available
            <div className="col-span-full text-center py-12">
              <div className="text-gray-600 text-lg font-semibold mb-4">No subscription plans available</div>
            </div>
          ) : (
            pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              whileHover={{
                y: -12,
                scale: 1.03,
                rotateX: 5,
                rotateY: 0
              }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              onHoverStart={() => setHoveredCard(plan.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className={`
                relative rounded-2xl p-6 lg:p-8 hover:shadow-2xl border border-gray-200
                transition-all duration-200 ease-out will-change-transform
                ${getCardStyle(plan.id, plan.isPopular || false)}
              `}
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Icon - Top Right */}
              <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-ful flex items-center justify-center">
                  <Image
                    src={plan.icon}
                    alt={`${plan.title} icon`}
                    width={32}
                    height={32}
                    className="w-6 h-6 lg:w-8 lg:h-8"
                  />
                </div>
              </div>

              {/* Plan Name */}
              <div className="mb-2 mt-4">
                <h3 className="text-xl lg:text-2xl font-bold text-left">
                  {plan.title}
                </h3>
              </div>

              {/* Plan Description */}
              <div className="mb-6 mr-6">
                <p className="text-sm lg:text-base opacity-90 leading-relaxed text-left">
                  {plan.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="text-3xl lg:text-4xl font-bold text-left">
                  {plan.price}
                  <span className="text-base lg:text-md font-normal opacity-80">/month</span>
                </div>
              </div>

              {/* Join Now Button */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`
                  w-full py-3 lg:py-3 px-6 rounded-xl font-semibold text-base lg:text-lg
                  transition-all duration-300 mb-8
                  ${getButtonStyle(plan.id, plan.isPopular || false)}
                `}
              >
                Join Now
              </motion.button>

              {/* Features List */}
              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-1">
                      <Image
                        src="/check.svg"
                        alt="Check"
                        width={20}
                        height={20}
                        className={`w-5 h-5 transition-all duration-200 ease-out ${
                          hoveredCard === plan.id || (hoveredCard === null && plan.isPopular)
                            ? 'filter brightness-0 invert transform scale-110' 
                            : 'transform scale-100'
                        }`}
                      />
                    </div>
                    <p className="text-sm lg:text-base leading-relaxed opacity-90 flex-1">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
