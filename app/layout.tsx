import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import { GlobalPointer } from "@/components/global-pointer";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Music Collection",
  description: "A personal music hosting site for my original tracks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>
            <div className="relative min-h-screen ">
              {/* Background layers */}
              <div className="fixed inset-0">
                <StarsBackground
                  starDensity={0.0003}
                  allStarsTwinkle={true}
                  twinkleProbability={0.8}
                  minTwinkleSpeed={0.3}
                  maxTwinkleSpeed={0.8}
                  className="z-0"
                />
                <ShootingStars
                  className="z-10"
                  minDelay={1000}
                  maxDelay={3000}
                  minSpeed={15}
                  maxSpeed={35}
                  starColor="#ffffff"
                  trailColor="#4f46e5"
                  starWidth={15}
                  starHeight={2}
                />
              </div>

              {/* Main content */}
              <div className="relative z-20">{children}</div>
            </div>
            <GlobalPointer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
