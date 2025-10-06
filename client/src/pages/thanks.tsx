
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function Thanks() {
  useEffect(() => {
    // Fire Google Ads conversion tracking when thanks page loads
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17589875168'
      });
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)] flex flex-col items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-6">
          Thank you.
        </h1>
        <p className="text-soft-grey text-lg mb-8 leading-relaxed">
          We've received your enquiry and will be in touch soon to discuss your wedding day.
        </p>
        <a
          href="/"
          className="inline-block btn-outline"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
