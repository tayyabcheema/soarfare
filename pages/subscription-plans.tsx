import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialSection from '../components/TestimonialSection';
import PlanAheadSection from '../components/PlanAheadSection';
import BlogSliderSection from '../components/BlogSliderSection';
import PricingSection from '../components/PricingSection';
import JourneySection from '../components/JourneySection';
import PricingHeadingSection from '../components/PricingHeadingSection';

const SubscriptionPlans = () => {
      const handleJoinSoarFare = () => {
        // Handle button click - could navigate to registration or scroll to signup
        console.log('Join SoarFare clicked');
        // Example: router.push('/register') or scroll to a section
    };
    return (
        <>
            <SEO
                title="Subscription Plans & Pricing"
                description="Choose the perfect SoarFare subscription plan for your travel needs. Compare Basic, Standard, and Premium plans with exclusive flight deals, priority booking, and travel rewards."
                keywords="SoarFare subscription, flight deals membership, travel plans, premium flight booking, travel membership, flight subscription service"
                image="/cta_home.jpg"
            />
            <Header />
             <div className="pt-20 md:pt-24"></div>
            <PricingHeadingSection />
            <PricingSection showHeading={false} />
            <JourneySection />
              <PlanAheadSection
                subtitle="Whether you're a new traveler, or an experienced world wanderer, we want to help make it easier for you to get there. We want to offer more ways to book flights, so you decide which option is best for you, instead of a one size fits all booking!"
                heading={[
                    "Why Soarfare"
                ]}
                buttonText="Unlock Your Journey"
                backgroundImage="/cta_subscription.jpg"
                onButtonClick={handleJoinSoarFare}
                reverseOrder={true}
                subtitleWeight="thin"
            />
            <BlogSliderSection />
             <TestimonialSection />
            <Footer />
        </>
    );
};

export default SubscriptionPlans;