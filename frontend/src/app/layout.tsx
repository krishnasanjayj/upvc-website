import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingActions from "../components/FloatingActions";
import ExitIntentPopup from "../components/ExitIntentPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium uPVC Doors & Windows Solutions | V-Tech Profiles",
  description: "Manufactures, supplies, and installs custom, energy-efficient, weather-resistant uPVC doors and windows. Get an instant quote online.",
  keywords: [
    "uPVC Doors", "uPVC Windows", "Sliding Windows", "Casement Windows", 
    "uPVC Installation", "Custom uPVC Doors", "uPVC Doors and Windows Near Me"
  ],
  openGraph: {
    title: "Premium uPVC Doors & Windows Solutions | V-Tech Profiles",
    description: "German-engineered custom uPVC window and door systems with real-time quotation calculator.",
    url: "https://upvcwebsite.com",
    type: "website",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "V-Tech Profiles uPVC Installation",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-sans">
        <LanguageProvider>
          <Header />
          <main className="flex-grow pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <FloatingActions />
          <ExitIntentPopup />
        </LanguageProvider>
      </body>
    </html>
  );
}
