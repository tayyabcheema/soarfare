import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FlightSearch from '../components/FlightSearch';
import Features from '../components/Features';
import Benefits from '../components/Benefits';
import WhyChooseSoarFareSection from '../components/WhyChooseSoarFareSection';
import PricingSection from '../components/PricingSection';
import PopularDestinationsSlider from '../components/PopularDestinationsSlider';
import PlanAheadSection from '../components/PlanAheadSection';
import BlogSliderSection from '../components/BlogSliderSection';
import FAQSection from '../components/FAQSection';
import TestimonialSection from '../components/TestimonialSection';
import Footer from '../components/Footer';

const Home = () => {
    const handleJoinSoarFare = () => {
        // Handle button click - could navigate to registration or scroll to signup
        console.log('Join SoarFare clicked');
        // Example: router.push('/register') or scroll to a section
    };

    return (
        <>
            <SEO
                title="Home"
                description="Discover amazing flight deals and destinations with SoarFare. Book cheap flights, explore popular destinations like Maldives, Istanbul, and London. Plan ahead, save now, and fly anywhere with our unbeatable prices."
                keywords="cheap flights, flight deals, travel destinations, Maldives flights, Istanbul travel, London flights, airline tickets, vacation deals, travel booking"
                image="/cta_home.jpg"
            />
            <Header />
            <Hero />
            <FlightSearch />
            <Features />
            <Benefits />
            <WhyChooseSoarFareSection />
            <PricingSection />
            <PopularDestinationsSlider />
            <PlanAheadSection
                subtitle="Can't Decide Where To Go?"
                heading={[
                    "Plan Ahead,",
                    "Save Now,",
                    "Fly Anywhere"
                ]}
                buttonText="Join SoarFare"
                backgroundImage="/cta_home.jpg"
                onButtonClick={handleJoinSoarFare}
            />
            <BlogSliderSection />
            <FAQSection />
            <TestimonialSection />
            <Footer />
        </>
    );
};

export default Home;