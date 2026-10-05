import type { Metadata } from "next";
import { Playpen_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import Script from "next/script";
import { TestModeLoader } from "@/components/test-mode-loader";

const playpenSans = Playpen_Sans({
  variable: "--font-playpen-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ANDIKA - Learn. Practice. Master Typing.",
  description: "A modern typing-learning and typing-performance platform. Improve your typing speed and accuracy with structured lessons, practice modes, and real-time competitions.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playpenSans.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TestModeLoader />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
