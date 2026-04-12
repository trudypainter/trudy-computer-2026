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
    images: [{ url: "/og-blank.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
    title: "Trudy Painter",
    description: "Creative engineer, building Gizmo",
    images: ["/og-blank.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "none" as any,
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
          <nav>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main>{children}</main>
        {/* <ColorDebug /> */}
      </body>
    </html>
  );
}
