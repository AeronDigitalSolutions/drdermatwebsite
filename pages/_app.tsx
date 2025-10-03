import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/CartContext"; // ✅ fixed path
import AnimatedCursor from "react-animated-cursor";
import { useEffect, useState } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check screen width on mount
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768); // desktop if width >= 768px
    };

    checkScreen();
    window.addEventListener("resize", checkScreen); // update on resize

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Component {...pageProps} />

        {isDesktop && (
          <AnimatedCursor
            innerSize={12}
            outerSize={20}
            color="79, 70, 229" // Indigo (R,G,B)
            outerAlpha={0.3}
            innerScale={0.7}
            outerScale={2}
          />
        )}
      </CartProvider>
    </SessionProvider>
  );
}
