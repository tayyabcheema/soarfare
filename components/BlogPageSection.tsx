import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { fetchBlogs, Blog } from '../utils/blogApi';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  slug: string;
  rating: number;
  readMoreLink?: string;
}

interface BlogPageSectionProps {
  className?: string;
}

const BlogPageSection: React.FC<BlogPageSectionProps> = ({ className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetchBlogs();
        
        if (response.success && response.data.blogs.length > 0) {
          const transformedBlogs: BlogPost[] = response.data.blogs.map((blog: Blog, index: number) => ({
            id: index + 1,
            title: blog.title,
            description: blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
            image: blog.image,
            date: new Date(blog.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            slug: blog.slug,
            rating: 5 
          }));
          setBlogData(transformedBlogs);
        }
      } catch (error) {
        console.error('Error loading blogs:', error);
        setBlogData([
          {
            id: 1,
            title: "Maldives Tour Guide",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod. Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod",
            image: "/destination1.jpg",
            date: "25 Oct 2024",
            rating: 5,
            slug: "maldives-tour-guide"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-500 ml-1">({rating}+ Rating)</span>
      </div>
    );
  };

  return (
    <section className={`w-full bg-gray-50 py-16 md:py-20 lg:py-24 ${className}`}>
      <div className="w-[90%] lg:w-[80%] mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <motion.h1 
              variants={titleVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0C2442] leading-tight mb-6"
            >
              Our Blogs
            </motion.h1>
            
            <motion.p 
              variants={titleVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              SoarFare is great for those that love to travel to always be<br />
              building up points for the next great adventure!
            </motion.p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
            </div>
          ) : (
            /* Blog Grid */
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogData.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={cardVariants}
                  className="bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group border border-gray-200 overflow-hidden"
                >
                  {/* Heart Icon - Top Right */}
                  <div className="relative">
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
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Star Rating */}
                    {/* <StarRating rating={blog.rating} /> */}

                    {/* Title */}
                    <Link href={`/blog/${blog.slug}`}>
                      <h3 className="text-xl font-semibold text-[#0C2442] mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200 cursor-pointer">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {blog.description}
                    </p>

                    {/* Footer - Read More and Date */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      {/* Read More Link */}
                      <Link href={`/blog/${blog.slug}`}>
                        <button className="text-blue-300 text-sm font-medium hover:text-orange transition-colors duration-200 flex items-center space-x-2 group/btn">
                          <span>Read More</span>
                          <svg 
                            className="w-4 h-4 transform transition-transform duration-200 group-hover/btn:translate-x-1" 
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
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPageSection;
