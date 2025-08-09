import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogPageSection from '../components/BlogPageSection';

const Blogs = () => {
    return (
        <>
            <SEO
                title="Travel Blogs & Guides"
                description="Explore our comprehensive travel guides and blogs. Discover Maldives tour tips, cheap travel locations, destination guides for Mykonos, Santorini, Istanbul, and more travel insights."
                keywords="travel blogs, travel guides, Maldives tour guide, cheap travel locations, Mykonos travel, Santorini guide, Istanbul travel tips, destination guides"
                image="/blog1.jpg"
            />
                        <Header />
            {/* Add top spacing to account for fixed header */}
            <div className="pt-20 md:pt-24">
                <BlogPageSection />
            </div>
            <Footer />
        </>
    );
};

export default Blogs;