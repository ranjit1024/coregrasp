import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// layout.tsx
import { Instrument_Serif, DM_Sans } from 'next/font/google'

const instrumentSerif = Instrument_Serif({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-instrument-serif'
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans'
})

export const metadata: Metadata = {
  title: {
    default: "CoreGrasp — AI Policy Compliance Verification",
    template: "%s | CoreGrasp",
  },
  description:
    "Upload any internal policy and CoreGrasp generates AI assessments, tracks completion, and verifies employee comprehension across your organization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}