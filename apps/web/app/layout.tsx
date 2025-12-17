import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Toaster } from "@repo/ui/sonner";
import { TRPCProvider } from "@repo/api/react";
import { UserNav } from "@/components/layout";
import { APP_NAME, APP_DESCRIPTION, ROUTES } from "@/lib/constants";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full flex flex-col`}>
        <TRPCProvider>
          <header className="border-b shrink-0">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <Link href={ROUTES.HOME} className="text-lg font-semibold">
                {APP_NAME}
              </Link>
              <UserNav />
            </div>
          </header>
          <div className="flex-1 flex flex-col">{children}</div>
        </TRPCProvider>
        <Toaster />
      </body>
    </html>
  );
}
