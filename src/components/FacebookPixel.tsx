"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { FPixel } from "@/lib/pixel";

const FacebookPixel = () => {
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    FPixel.track("PageView");
  }, [pathname, loaded]);

  return (
    <div>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
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
            
            const pixelIds = "${
              process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_IDS || ""
            }".split(",").map(id => id.trim()).filter(id => id);
            pixelIds.forEach(id => {
              fbq('init', id);
            });
            
            fbq('track', 'PageView');
          `,
        }}
      />
    </div>
  );
};

export default FacebookPixel;
