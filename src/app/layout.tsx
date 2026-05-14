import type { Metadata } from "next";
import Script from "next/script";

import { AuthProvider } from "@/components/auth-context";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "./globals.css";

const themeInitScript = `(() => {
  try {
    const savedTheme = localStorage.getItem("theme");
    const shouldUseDark = savedTheme ? savedTheme === "dark" : true;
    document.documentElement.classList.toggle("dark", shouldUseDark);
  } catch {}
})();`;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://fingoh.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Fingoh | B2B Trade Fair & Exhibition Platform",
    template: "%s | Fingoh",
  },
  description: "Fingoh is a trade fair organiser platform where exhibitors, visitors, sponsors and vendors collaborate to run world-class B2B exhibitions and trade fairs.",
  keywords: ["trade fair", "B2B exhibitions", "trade fair organiser", "booth booking", "exhibition platform", "expo SaaS", "event management"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
