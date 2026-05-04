import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Free AI Cover Letter Generator – No Signup | InstantCoverLetter.ai",
    template: "%s | InstantCoverLetter.ai",
  },
  description:
    "Generate tailored cover letters in seconds with AI. 100% free, no signup, no email required. Paste your background + job description and get a custom letter ready to send.",
  keywords: [
    "cover letter generator",
    "AI cover letter",
    "free cover letter",
    "cover letter writer",
    "job application",
    "resume cover letter",
    "tailored cover letter",
  ],
  authors: [{ name: "InstantCoverLetter.ai" }],
  creator: "InstantCoverLetter.ai",
  metadataBase: new URL("https://instant-cover-letter-steel.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free AI Cover Letter Generator – No Signup",
    description:
      "Generate tailored cover letters in seconds. Free, no signup. Paste your background + job description, get a letter instantly.",
    url: "https://instant-cover-letter-steel.vercel.app",
    siteName: "InstantCoverLetter.ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InstantCoverLetter.ai - Free AI Cover Letter Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Cover Letter Generator – No Signup",
    description:
      "Generate tailored cover letters in seconds. Free, no signup, no email.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
  google: "8rodz_1_naflPsfuuqYAUy_CHbm7v5QEE-9r2UvCkFI",
},
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "impact-site-verification": "d7efa8ff-fff5-4824-93e1-9a38fd81395f",
  },
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
      <head>
        <meta name="impact-site-verification" content="d7efa8ff-fff5-4824-93e1-9a38fd81395f" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
         <SpeedInsights />
        <Script id="impact-tracker" strategy="afterInteractive">
          {`(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7265734-1451-4faf-bbbc-d52d4dca90731.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`}
        </Script>
      </body>
    </html>
  );
}