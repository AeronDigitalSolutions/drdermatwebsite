import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/CartContext"; // ✅ fixed path
import AnimatedCursor from "react-animated-cursor";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Component {...pageProps} />
  

      </CartProvider>
            <AnimatedCursor
  innerSize={12}
  outerSize={20}
  color="79, 70, 229" // Indigo (R,G,B)
  outerAlpha={0.3}
  innerScale={0.7}
  outerScale={2}
/>
    </SessionProvider>
  );
}
