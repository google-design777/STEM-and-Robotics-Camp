import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Literacy Camp · AKLEB STEM & Robotics",
  description:
    "Register for the AI Literacy Camp — a 10-hour, 5-session course for young people aged 11–18. Hands-on experience with Claude, ChatGPT, Perplexity, Canva, Udio, and Teachable Machine. Organized by AKLEB STEM & Robotics at Madina Tul Karim Nomal JK.",
  keywords: [
    "AI Literacy",
    "STEM Camp",
    "Robotics",
    "AKLEB",
    "Madina Tul Karim Nomal",
    "AI for students",
    "Hands-on AI",
  ],
  authors: [{ name: "AKLEB STEM & Robotics" }],
  openGraph: {
    title: "AI Literacy Camp · AKLEB STEM & Robotics",
    description:
      "A 10-hour, 5-session AI literacy course for ages 11–18. Hands-on, real tools, real thinking. Register now at Madina Tul Karim Nomal JK.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Literacy Camp · AKLEB STEM & Robotics",
    description:
      "A 10-hour, 5-session AI literacy course for ages 11–18. Hands-on, real tools, real thinking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
