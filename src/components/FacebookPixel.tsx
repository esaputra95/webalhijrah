"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // track page view on route change
    // Using a timeout to ensure the script has likely loaded/initialized the stub
    const trackPageView = () => {
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView");
      }
    };

    // Small delay to ensure script stub is present on initial load
    const timeoutId = setTimeout(trackPageView, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  if (!FB_PIXEL_ID) return null;

  return (
    <Script
      id="facebook-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', '${FB_PIXEL_ID}');
        `,
      }}
    />
  );
}
