import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuFlow — Digital Dining & QR Restaurant Operating System",
  description:
    "Turn every table into a digital ordering experience. High-performance QR dining, instant kitchen control, real-time analytics, and contactless table turnover for modern restaurants.",
  keywords: [
    "QR menu",
    "digital restaurant menu",
    "table ordering",
    "restaurant POS",
    "contactless dining",
    "MenuFlow",
    "India restaurant tech",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#080A0C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-primary antialiased font-sans selection:bg-accent/25 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
