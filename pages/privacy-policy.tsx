import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <>
            <Header />
            {/* Add top spacing to account for fixed header */}
            <div className="pt-20 md:pt-24">
                <div>
                    <h1>Privacy Policy</h1>
                    <p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.</p>
                    <h2>Information We Collect</h2>
                    <p>We may collect personal information such as your name, email address, and payment information when you register or make a purchase.</p>
                    <h2>How We Use Your Information</h2>
                    <p>Your information may be used to provide services, process transactions, and communicate with you about your account or services.</p>
                    <h2>Data Protection</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information.</p>
                    <h2>Changes to This Privacy Policy</h2>
                    <p>We may update this privacy policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account or by placing a prominent notice on our site.</p>
                    <h2>Contact Us</h2>
                    <p>If you have any questions about this privacy policy, please contact us.</p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;