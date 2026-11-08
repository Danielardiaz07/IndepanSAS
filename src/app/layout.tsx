import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/config/site";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { JsonLd } from "@/components/ui/json-ld";
import { localBusinessJsonLd } from "@/lib/seo";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const body = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name} | Insumos de panadería y repostería en Valledupar`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "insumos de panadería Valledupar",
    "insumos de repostería Valledupar",
    "harinas Valledupar",
    "levadura Valledupar",
    "moldes y capacillos Valledupar",
    "empaques para panadería",
    "Indepan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f89818" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0f0a" },
  ],
};

/** Aplica el tema guardado antes del primer pintado para evitar el parpadeo. */
const themeInit = `(function(){try{var t=localStorage.getItem('indepan:theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-btn focus:px-4 focus:py-2 focus:text-on-btn"
        >
          Saltar al contenido
        </a>
        <CartProvider>
          <Header />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppFab />
          <CartDrawer />
        </CartProvider>
        <JsonLd data={localBusinessJsonLd()} />
        <Analytics />
        {site.analytics.gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics.gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${site.analytics.gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
