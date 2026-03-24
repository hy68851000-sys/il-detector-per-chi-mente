import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Detector per Chi Mente",
  description: "AI-powered lie detector",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
