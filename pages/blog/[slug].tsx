import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogSliderSection from '../../components/BlogSliderSection';

interface BlogDetailProps {
  blog: {
    title: string;
    image: string;
    created_at: string;
    slug: string;
    content: string;
  } | null;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog }) => {
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <Link href="/blogs" className="text-blue-600 hover:text-blue-800">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>{blog.title} - SoarFare Blog</title>
        <meta name="description" content={blog.content.substring(0, 160)} />
      </Head>

      <Header />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Article Header */}
          <div className="relative -mt-20 lg:-mt-32 z-10">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 lg:p-12">
              {/* Date Badge */}
              <div className="flex items-center mb-6">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">{formatDate(blog.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-8">
                {blog.title}
              </h1>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none
                           prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                           prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-6
                           prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                           prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                           prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
                           prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                           prose-ul:my-6 prose-ul:space-y-2 prose-li:text-gray-700 prose-li:leading-relaxed
                           prose-ol:my-6 prose-ol:space-y-2
                           prose-strong:text-gray-900 prose-strong:font-semibold
                           prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                           prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                           prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
                           prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                           prose-pre:bg-gray-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>

        {/* Blog Slider Section */}
        <div className="mt-16 lg:mt-24">
          <BlogSliderSection />
        </div>
      </div>

      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  try {
    // Fetch blog data from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog`);
    const data = await response.json();

    if (data.success) {
      const blog = data.data.blogs.find((b: any) => b.slug === slug);
      
      return {
        props: {
          blog: blog || null
        }
      };
    }

    return {
      props: {
        blog: null
      }
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      props: {
        blog: null
      }
    };
  }
};

export default BlogDetail;
