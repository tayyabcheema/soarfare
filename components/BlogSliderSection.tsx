import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useMotionValue } from 'framer-motion';
import { fetchBlogs, Blog } from '../utils/blogApi';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  slug: string;
  readMoreLink?: string;
}

interface BlogSliderSectionProps {
  className?: string;
}

const BlogSliderSection: React.FC<BlogSliderSectionProps> = ({ className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const x = useMotionValue(0);

  // Fetch blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetchBlogs();
        
        if (response.success && response.data.blogs.length > 0) {
          // Transform API data to component format
          const transformedBlogs: BlogPost[] = response.data.blogs.map((blog: Blog, index: number) => ({
            id: index + 1,
            title: blog.title,
            description: blog.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...',
            image: blog.image,
            date: new Date(blog.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            slug: blog.slug
          }));
          setBlogData(transformedBlogs);
        } else {
          // Fallback to mock data if API fails
          setBlogData([
            {
              id: 1,
              title: "Maldives Tour Guide",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod",
              image: "/destination2.jpg",
              date: "25 Oct 2024",
              slug: "maldives-tour-guide"
            },
            {
              id: 2,
              title: "Top 5 Cheap Travel Locations",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod.",
              image: "/blog2.jpg",
              date: "25 Oct 2024",
              slug: "top-5-cheap-travel-locations"
            },
            {
              id: 3,
              title: "Mykonos And Santorini Tour",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod.",
              image: "/blog3.jpg",
              date: "25 Oct 2024",
              slug: "mykonos-and-santorini-tour"
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading blogs:', error);
        // Fallback data on error
        setBlogData([
          {
            id: 1,
            title: "Maldives Tour Guide",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod",
            image: "/destination2.jpg",
            date: "25 Oct 2024",
            slug: "maldives-tour-guide"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Calculate total slides based on screen size
  const getCardsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 3; // desktop
    }
    return 3; // default for SSR
  };

  const [cardsPerSlide, setCardsPerSlide] = React.useState(3);
  const totalSlides = Math.ceil(blogData.length / cardsPerSlide);

  React.useEffect(() => {
    const updateCardsPerSlide = () => {
      setCardsPerSlide(getCardsPerSlide());
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  // Navigation handlers
  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? totalSlides - 1 : activeIndex - 1;
    const cardWidth = containerRef.current ? containerRef.current.offsetWidth : 800;
    const targetX = -newIndex * cardWidth;
    x.set(targetX);
    setActiveIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === totalSlides - 1 ? 0 : activeIndex + 1;
    const cardWidth = containerRef.current ? containerRef.current.offsetWidth : 800;
    const targetX = -newIndex * cardWidth;
    x.set(targetX);
    setActiveIndex(newIndex);
  };

  const handleDotClick = (index: number) => {
    const cardWidth = containerRef.current ? containerRef.current.offsetWidth : 800;
    const targetX = -index * cardWidth;
    x.set(targetX);
    setActiveIndex(index);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
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
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Group blog posts into slides
  const getSlideData = () => {
    const slides = [];
    for (let i = 0; i < blogData.length; i += cardsPerSlide) {
      slides.push(blogData.slice(i, i + cardsPerSlide));
    }
    return slides;
  };

  const slideData = getSlideData();

  return (
    <section className={`w-full bg-white py-12 md:py-16 lg:py-20 ${className}`}>
      <div className="w-[90%] lg:w-[80%] mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <motion.p 
              variants={titleVariants}
              className="text-blue-300 text-sm md:text-base font-medium mb-4"
            >
              Blogs
            </motion.p>
            
            <motion.h2 
              variants={titleVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0C2340] leading-tight"
            >
              Our Blogs
            </motion.h2>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
            </div>
          ) : (
            <>
              {/* Slider Container */}
              <div className="relative">
                {/* Slider with overflow hidden */}
                <div className="overflow-hidden">
                  <motion.div
                    ref={containerRef}
                    className="flex"
                    style={{ x }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {slideData.map((slide, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="w-full flex-shrink-0"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {slide.map((blog) => (
                            <motion.div
                              key={blog.id}
                              variants={cardVariants}
                              className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group border border-gray-200"
                            >
                              {/* Blog Image */}
                              <Link href={`/blog/${blog.slug}`}>
                                <div className="relative w-full h-56 md:h-60 lg:h-64 cursor-pointer">
                                  <Image
                                    src={`https://soarfare.com${blog.image}`}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  />
                                </div>
                              </Link>

                              {/* Blog Content */}
                              <div className="p-8 h-58">
                                {/* Title */}
                                <Link href={`/blog/${blog.slug}`}>
                                  <h3 className="text-xl font-semibold text-[#0C2340] mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200 cursor-pointer">
                                    {blog.title}
                                  </h3>
                                </Link>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-12 line-clamp-2">
                                  {blog.description}
                                </p>

                                {/* Divider Line */}
                                <div className="border-t border-gray-300 mb-6"></div>

                                {/* Footer - Read More and Date */}
                                <div className="flex items-center justify-between">
                                  {/* Read More Link */}
                                  <Link href={`/blog/${blog.slug}`}>
                                    <button className="text-blue-300 text-sm font-medium hover:text-orange transition-colors duration-200 flex items-center space-x-2 group">
                                      <span>Read More</span>
                                      <svg 
                                        className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" 
                                        viewBox="0 0 24 24" 
                                        fill="none"
                                      >
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                  </Link>

                                  {/* Date */}
                                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <span>{blog.date}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Dots Navigation */}
                {slideData.length > 1 && (
                  <div className="flex justify-center mt-8 space-x-3">
                    {slideData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                          index === activeIndex 
                            ? 'bg-blue-300 scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSliderSection;

