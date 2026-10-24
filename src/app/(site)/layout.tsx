import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import ScrollToTop from "@/components/site/scroll-to-top";
import { getSettings, getSocialLinks } from "@/lib/queries";
import { OWNER_NAME } from "@/lib/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, socials] = await Promise.all([
    getSettings(),
    getSocialLinks(),
  ]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow"
      >
        Aller au contenu
      </a>
      <Navbar siteName={OWNER_NAME} />
      <main id="main">{children}</main>
      <Footer settings={settings} socials={socials} siteName={OWNER_NAME} />
      <ScrollToTop />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
