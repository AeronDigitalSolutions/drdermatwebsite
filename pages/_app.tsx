import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import AnimatedCursor from "react-animated-cursor";

// ✅ Contexts
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { OrderProvider } from "@/context/OrderContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };



   
    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <SessionProvider session={session}>
      <UserProvider>
        <CartProvider>
          <OrderProvider>
            <Component {...pageProps} />

            {isDesktop && (
              <AnimatedCursor
                innerSize={12}
                outerSize={20}
                color="79, 70, 229"
                outerAlpha={0.3}
                innerScale={0.7}
                outerScale={2}
              />
            )}
          </OrderProvider>
        </CartProvider>
      </UserProvider>
    </SessionProvider>
  );
}
