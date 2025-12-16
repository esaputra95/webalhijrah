declare global {
  interface Window {
    fbq?: (event: string, eventName: string, data?: unknown) => void;
  }
}

export const FPixel = {
  track: (event: string, data?: unknown) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", event, data);
    } else {
      console.warn("Facebook Pixel not initialized or blocked");
    }
  },
};
