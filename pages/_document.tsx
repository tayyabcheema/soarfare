import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#0C2340" />
        
        {/* Global Meta */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="SoarFare" />
        {/* Removed viewport meta tag from here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
