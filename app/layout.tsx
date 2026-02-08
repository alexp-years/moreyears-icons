import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const moreYears = localFont({
  variable: "--font-moreyears",
  display: "swap",
  src: [
    {
      path: "../public/fonts/MoreYears-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "More Years Design System",
  description: "Living documentation for the More Years design system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${moreYears.variable} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
