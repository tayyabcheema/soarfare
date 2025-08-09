import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import AboutUsSection from '../components/AboutUsSection';
import Footer from '../components/Footer';
import TestimonialSection from '../components/TestimonialSection';
import PlanAheadSection from '../components/PlanAheadSection';
import FeaturesAbout from '../components/FeaturesAbout';
import WhyChooseSection from '../components/WhyChooseSection';

const About = () => {
    const handleJoinSoarFare = () => {
        console.log('Join SoarFare clicked');

    };
    return (
        <>
            <SEO
                title="About Us"
                description="Learn about SoarFare's mission to make travel accessible and affordable for everyone. Discover our story, values, and commitment to providing the best flight deals and travel experiences."
                keywords="about SoarFare, travel company, flight booking service, travel mission, affordable flights, travel vision"
                image="/about.jpg"
            />
            <Header />
            <div className="pt-20 md:pt-24">
                <AboutUsSection />
                <FeaturesAbout />
                <WhyChooseSection />
                <PlanAheadSection
                    subtitle="Can't Decide Where To Go?"
                    heading={[
                        "Explore New",
                        "Destinations"
                    ]}
                    buttonText="Serach Flights"
                    backgroundImage="/about/cta_about.jpg"
                    onButtonClick={handleJoinSoarFare}
                />
                <TestimonialSection />
            </div>
            <Footer />
        </>
    );
};

export default About; 11