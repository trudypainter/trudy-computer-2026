import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { diatype, diatypeMono } from "./fonts";

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
    <html lang="en" className={`${diatype.variable} ${diatypeMono.variable}`}>
      <body>
        <header>
          <Link href="/">Trudy Painter</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
