import type { Metadata } from "next";
import "@styles/_globals.scss";
import { AppProvider } from "@/hooks/context/AppProvider";

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
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
