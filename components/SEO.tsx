import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  article?: boolean;
  noindex?: boolean;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  article = false,
  noindex = false,
  canonicalUrl
}) => {
  const router = useRouter();
  
  // Default values
  const siteTitle = 'SoarFare';
  const defaultTitle = 'SoarFare - Plan Ahead, Save Now, Fly Anywhere';
  const defaultDescription = 'Discover amazing flight deals and destinations with SoarFare. Book cheap flights, explore popular destinations, and save on your next adventure. Your trusted travel partner for affordable air travel.';
  const defaultKeywords = 'cheap flights, flight deals, travel, destinations, airline tickets, vacation, travel booking, flight search, air travel, SoarFare';
  const defaultImage = '/cta_home.jpg';
  const siteUrl = 'https://soarfare.com'; // Replace with your actual domain

  // Computed values
  const pageTitle = title ? `${title} | ${siteTitle}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const pageImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;
  const pageUrl = canonicalUrl || `${siteUrl}${router.asPath}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SoarFare" />
      <meta name="twitter:creator" content="@SoarFare" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="application-name" content={siteTitle} />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': article ? 'Article' : 'Organization',
            name: siteTitle,
            url: siteUrl,
            logo: `${siteUrl}/favicon.svg`,
            description: pageDescription,
            ...(article ? {
              headline: title,
              image: pageImage,
              datePublished: new Date().toISOString(),
              author: {
                '@type': 'Organization',
                name: siteTitle
              }
            } : {
              sameAs: [
                'https://facebook.com/soarfare',
                'https://twitter.com/soarfare',
                'https://instagram.com/soarfare'
              ]
            })
          })
        }}
      />
    </Head>
  );
};

export default SEO;
