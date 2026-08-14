import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import GridBackground from "../components/GridBackground";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "gitfind",
  description: "Find any GitHub user from a terminal-style console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${inter.variable} ${pressStart.variable} antialiased`}
      >
        <GridBackground />
        {children}
      </body>
    </html>
  );
}
