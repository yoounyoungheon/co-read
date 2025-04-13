import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./utils/style/fonts";
import { Nav } from "./ui/components/view/nav/nav";

export const metadata: Metadata = {
  title: "iamyounghun",
  description: "Generated by Young-Heon",
};

export default function RootLayout({children}:{children: React.ReactNode;}){
  return (
    <html lang="en">
      <body className={`${inter.className}, bg-slate-100`}>
        <Nav/>
        {children}
      </body>
    </html>
  );
}
