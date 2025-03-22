import { AppProps } from 'next/app'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GoogleAnalytics } from "nextjs-google-analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalyticsConfig from "@/components/GoogleAnalyticsConfig";
import Container from "@/components/Container";
import SystemConfig from "@/helpers/config";
import '@/styles/globals.css';
import '../../i18n';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);

    const handleRouteChange = () => {};
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  // Prevent the Hydration problem
  if (!isReady) return null;

  return (
    <>
      <GoogleAnalytics trackPageViews />
      <SystemConfig/>
      <GoogleAnalyticsConfig></GoogleAnalyticsConfig>
      <Navbar/>
      <Container>
        <Component {...pageProps} />
      </Container>
      <Footer />
    </>
  );
}

export default App;
