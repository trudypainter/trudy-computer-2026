import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trudy Painter",
  description: "Software engineer, making AI experiments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/">Trudy Painter</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
