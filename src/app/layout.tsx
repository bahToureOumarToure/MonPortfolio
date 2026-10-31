import "./globals.css";

// Le document HTML (langue, sens d'écriture, thème) est rendu par les layouts
// enfants : src/app/[locale]/layout.tsx pour le site, src/app/admin/layout.tsx
// pour l'admin. Ce layout racine ne fait que transmettre.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
