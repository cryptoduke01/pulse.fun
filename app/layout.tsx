import type { Metadata } from "next";
import { Inter, Poppins, Fira_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "../src/components/ErrorBoundary";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "pulse.fun - Your wallet tells your story",
  description: "The social network for crypto traders. Connect your wallet and let your transactions become your social content.",
  keywords: ["crypto", "social", "trading", "wallet", "blockchain", "defi"],
  authors: [{ name: "pulse.fun Team" }],
  openGraph: {
    title: "pulse.fun - Your wallet tells your story",
    description: "The social network for crypto traders. Connect your wallet and let your transactions become your social content.",
    type: "website",
    siteName: "pulse.fun",
  },
  twitter: {
    card: "summary_large_image",
    title: "pulse.fun - Your wallet tells your story",
    description: "The social network for crypto traders. Connect your wallet and let your transactions become your social content.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${firaCode.variable}`}
    >
      <body className="font-body antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
