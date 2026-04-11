import localFont from "next/font/local";

export const diatype = localFont({
  src: [
    {
      path: "../public/fonts/diatype/ABCDiatype-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/diatype/ABCDiatype-Medium-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/diatype/ABCDiatype-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

export const diatypeMono = localFont({
  src: [
    {
      path: "../public/fonts/diatype-mono/ABCDiatypeMono-Regular-Trial.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mono",
});
