import type { Metadata } from "next";
import { Roboto_Condensed } from 'next/font/google'
import { Providers } from "./providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

const roboto_condensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'], // choose available weights
  variable: '--font-roboto', // optional for CSS custom property
  display: 'swap',
})

export const metadata: Metadata = {
  title: "TheM3 admin",
  description: "TheM3 Admin dashbord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto_condensed.className} ${roboto_condensed.variable}`}>
        <Providers>
            {children}
            <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
