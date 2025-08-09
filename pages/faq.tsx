import React from 'react';
import Header from '../components/Header';
import FAQPageSection from '../components/FAQPageSection';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const FAQ = () => {
    return (
        <>
            <SEO
                title="Frequently Asked Questions - SoarFare"
                description="Find answers to common questions about SoarFare's flight booking service, dashboard features, subscription plans, and travel booking process."
                canonicalUrl="/faq"
                noindex={true}
            />
            <Header />
            {/* Add top spacing to account for fixed header */}
            <div className="pt-20 md:pt-24">
                <main>
                    <FAQPageSection />
                </main>
            </div>
            <Footer />
        </>
    );
};

export default FAQ;