import type { Metadata, Viewport } from "next";
import RootDocument, { themeViewport } from "@/components/root-document";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export async function generateViewport(): Promise<Viewport> {
  return themeViewport();
}

// L'admin reste en français (outil du propriétaire du site).
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument lang="fr">{children}</RootDocument>;
}
