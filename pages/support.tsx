import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SupportSection from '../components/SupportSection';
import SEO from '../components/SEO';

const Support: React.FC = () => {
    return (
        <>
            <SEO
                title="Support - Get Help & Contact Us"
                description="Need help with your travel bookings? Contact SoarFare's support team. Get assistance with flight bookings, subscription plans, and travel queries. We're here to help!"
                keywords="support, customer service, help, contact us, travel assistance, flight booking help, SoarFare support"
            />
            <Header />
            {/* Add top spacing to account for fixed header */}
            <div className="pt-20 md:pt-24">
                <SupportSection />
            </div>
            <Footer />
        </>
    );
};

export default Support;