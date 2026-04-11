import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { diatype, diatypeMono } from "./fonts";
import ColorDebug from "../components/ColorDebug";

export const metadata: Metadata = {
  title: "Trudy Painter",
  description: "Creative engineer, building Gizmo",
  openGraph: {
    title: "Trudy Painter",
    description: "Creative engineer, building Gizmo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Trudy Painter",
    description: "Creative engineer, building Gizmo",
  },
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
          <Link href="/"><span className="header-icon">⊞</span> Trudy Painter</Link>
        </header>
        <main>{children}</main>
        {/* <ColorDebug /> */}
      </body>
    </html>
  );
}
