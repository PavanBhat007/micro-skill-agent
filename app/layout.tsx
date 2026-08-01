import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Micro Skill Agent",
  description: "Learn 1 actionable skill each day as per your profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html
        lang="en"
        className={`${oswald.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <Navbar />

          <main className="flex-1 w-full">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
