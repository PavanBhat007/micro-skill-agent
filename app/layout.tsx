import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-stone-50 text-stone-800 selection:bg-indigo-100 selection:text-indigo-700">
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
