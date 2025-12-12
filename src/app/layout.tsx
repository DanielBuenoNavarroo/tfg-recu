import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Inter, Merriweather, Crimson_Text } from "next/font/google";

import "./globals.css";

import localFont from "next/font/local";
import { Toaster } from "sonner";
import { auth } from "@/auth";

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merr = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
});
const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "Tfg",
  description: "Pagina web para la recuperación del tfc DAW - 2025",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body
          className={`${ibmPlexSans.className} ${crimson.variable} ${merr.variable} ${inter.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
