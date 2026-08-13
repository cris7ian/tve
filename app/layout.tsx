import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://tv.cristiancaroli.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TVE en directo",
  description: "Acceso sencillo al Canal 24 Horas de RTVE Noticias.",
  applicationName: "TVE en directo",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    title: "TVE en directo",
    description: "Acceso sencillo al Canal 24 Horas de RTVE Noticias.",
    images: [
      {
        url: "/og.png",
        width: 1730,
        height: 909,
        alt: "TVE en directo, Canal 24 Horas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TVE en directo",
    description: "Acceso sencillo al Canal 24 Horas de RTVE Noticias.",
    images: ["/og.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
