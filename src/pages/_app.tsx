import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { GoogleAnalytics } from "nextjs-google-analytics"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Container from "@/components/Container"
import SystemConfig from "@/helpers/config"
import '@/styles/globals.css'
import '../../i18n';

function App({ Component, pageProps }: any) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true); 

    const handleRouteChange = (url: string) => {
      // console.log('App is navigating to:', url);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  // Prevent the Hydration problem
  if (!isReady) return null;

  return (
    <>
        {/* <GoogleAnalytics trackPageViews /> */}
        <SystemConfig></SystemConfig>
        <Navbar></Navbar>
        <Container>
          <Component {...pageProps} />
        </Container>
        <Footer></Footer>
    </>
    );
}

export default App;
