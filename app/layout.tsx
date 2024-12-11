import type { Metadata } from "next";
import {  Ubuntu } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const ubuntu = Ubuntu({
  weight: ["400", "700"], // Optional: specify weights
  subsets: ["latin"], // Specify subsets
});

export const metadata: Metadata = {
  title: "Expense Mart",
  description: "The Next Gneration Expense App for Your Finance Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#121212] ${ubuntu.className}`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
        </body>
    </html>
  );
}
