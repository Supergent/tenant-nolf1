import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@jn704kmvn1w3p5a4xx8aankht17sksat/components";

export const metadata: Metadata = {
  title: "Minimal Todo - Task Management Made Simple",
  description: "A clean, minimal to-do list application with real-time synchronization and AI assistance",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
