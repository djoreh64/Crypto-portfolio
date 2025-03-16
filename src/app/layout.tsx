import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Providers } from "./providers";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Криптопортфель",
  description: "Отслеживайте ваши криптовалютные активы в реальном времени",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
