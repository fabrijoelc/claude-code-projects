import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxe Estate | Premium Real Estate & Sanctuary Finder",
  description: "Discover curated premium villas, penthouses, and luxury modern apartments at Luxe Estate. Find your perfect sanctuary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-nordic-dark transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
