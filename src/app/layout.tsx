import type { Metadata } from "next";
import "@styles/_globals.scss";
import { Poppins } from 'next/font/google'
import { AppProvider } from "@/hooks/context/AppProvider";

const poppins = Poppins({
  weight: '400',
  variable: "--font-poppins",
  subsets: ['latin']
})

export const metadata: Metadata = {
  icons: {
    icon: '/icon.svg'
  },
  title: "Book Keeper",
  description: "Save your books in a private list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
