import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import SessionWrapper from "@/components/SessionWrapper";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarVista Park Scheduling",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${inter.className} bg-indigo-100 text-indigo-900 flex flex-col min-h-screen`}
        >
          <Header />
          <NextUIProvider>{children}</NextUIProvider>
          <Footer />
        </body>
      </html>
    </SessionWrapper>
  );
}
