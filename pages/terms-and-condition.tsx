import React from 'react';
import Header from '../components/Header';

const TermsAndCondition = () => {
    return (
        <>
            <Header />
            {/* Add top spacing to account for fixed header */}
            <div className="pt-20 md:pt-24">
                <div>
                    <h1>Terms and Conditions</h1>
                    <p>
                        Welcome to our Terms and Conditions page. Please read these terms carefully before using our service.
                    </p>
                    <h2>1. Introduction</h2>
                    <p>
                        These terms govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.
                    </p>
                    <h2>2. Changes to Terms</h2>
                    <p>
                        We may update our terms from time to time. We will notify you of any changes by posting the new terms on this page.
                    </p>
                    <h2>3. User Responsibilities</h2>
                    <p>
                        You are responsible for your use of our services and for any content you provide. You agree not to use our services for any unlawful purpose.
                    </p>
                    <h2>4. Limitation of Liability</h2>
                    <p>
                        Our liability is limited to the maximum extent permitted by law. We are not liable for any indirect or consequential damages.
                    </p>
                    <h2>5. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of [Your Country/State]. Any disputes will be resolved in the courts of [Your Country/State].
                    </p>
                    <h2>6. Contact Us</h2>
                    <p>
                        If you have any questions about these terms, please contact us at [Your Contact Information].
                    </p>
                </div>
            </div>
        </>
    );
};

export default TermsAndCondition;