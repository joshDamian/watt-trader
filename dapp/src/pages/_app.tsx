import { type AppType } from "next/app";
import { Titillium_Web } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const titilliumWeb = Titillium_Web({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600", "700"],
});

const MyApp: AppType<{
  session: Session;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <main className={`font-sans ${titilliumWeb.variable} text-[#1A1A1A]`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default MyApp;
