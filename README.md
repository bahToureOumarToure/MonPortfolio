# Bah Oumar Touré — Portfolio

Portfolio personnel avec CMS intégré : un site public **clair, simple et rapide** et un
espace d'administration privé pour tout modifier sans toucher au code (textes, projets,
compétences, médias, CV… et l'apparence du site).

**En ligne :** [www.bahoumartoure.com](https://www.bahoumartoure.com)

---

## Stack

| Domaine     | Choix                                                                |
| ----------- | -------------------------------------------------------------------- |
| Framework   | Next.js 15 (App Router, Server Actions), React 18, TypeScript strict |
| Style       | Tailwind CSS 3 + design system à tokens CSS (`src/app/globals.css`)  |
| Données     | PostgreSQL (Vercel Postgres / Neon) via Prisma 6                     |
| Médias      | Vercel Blob (upload direct navigateur → Blob)                        |
| Auth admin  | Passkeys (WebAuthn) ou mot de passe + 2FA TOTP, sessions révocables  |
| Contact     | EmailJS                                                              |
| Qualité     | ESLint, TypeScript, Prettier (husky + lint-staged), Playwright (e2e) |
| Hébergement | Vercel (+ Analytics / Speed Insights), PWA                           |

## Fonctionnalités

**Site public** — accueil (hero, à propos, parcours, compétences, projets, contact),
liste des projets filtrable par technologie, page détail par projet, 404, SEO
(métadonnées, JSON-LD, `robots.txt`, `sitemap.xml`), responsive et accessible
(navigation clavier, lecteurs d'écran, `prefers-reduced-motion`).

**Langues** — anglais (par défaut, sur `/`), français (`/fr`), espagnol (`/es`) et
arabe (`/ar`, de droite à gauche). Sélecteur de langue dans la barre de navigation,
balises `hreflang`, sitemap multilingue. Les textes de l'interface sont dans
`messages/*.json` ; le contenu (projets, parcours, compétences…) se traduit dans
l'admin, onglets Français / Español / العربية sous chaque formulaire (un champ
vide affiche le texte anglais).

**Admin (`/admin`)** — tableau de bord, Profil & Hero, Projets (ordre, mise en avant,
visibilité), Compétences, Expérience, Formation, Liens sociaux, Médias, Apparence,
Paramètres & CV, Sécurité. Chaque modification est en ligne immédiatement.

**Apparence** — mode **Clair (par défaut)** / Sombre / Automatique, couleur d'accent
(10 teintes prêtes ou couleur libre), arrondis, aperçu en direct. Tout le site et
l'admin suivent ces réglages.

**Uploads** — diagnostic du stockage dans l'admin, envoi direct (jeton Blob) ou via le
serveur (store relié par OIDC), ajout d'image par lien, glisser-déposer, envoi multiple avec progression par fichier, validation
avant envoi, redimensionnement + conversion WebP automatiques des photos lourdes,
texte alternatif, recherche, « Utiliser pour… » (profil, hero, couverture de projet).

## Structure

```
prisma/
  schema.prisma        # modèle de données
  sql/                 # migrations ADDITIVES appliquées au build (voir plus bas)
  seed.ts              # import du contenu initial
scripts/
  db-sync.mjs          # applique prisma/sql/*.sql (build Vercel / npm run db:sync)
  e2e-admin.mjs        # compte admin des tests e2e (base de test uniquement)
e2e/                   # tests Playwright (site public + admin)
src/
  app/
    [locale]/          # pages publiques, une version par langue (en, fr, es, ar)
    admin/             # espace d'administration
    api/admin/         # auth, passkeys, upload
    globals.css        # tokens du design system
  components/
    ui/                # primitives (Button, Badge, Card, Input…)
    site/              # sections du site public
    admin/             # écrans et kit de l'admin
  lib/
    actions/           # Server Actions (retour { ok, data | error })
    validation/        # schémas Zod (messages en français)
    queries.ts         # lectures publiques mises en cache (+ repli sans base)
    theme.ts           # thème : tokens, presets, contrastes
  i18n/                # langues, liens localisés (next-intl)
messages/              # textes de l'interface : en, fr, es, ar
utils/                 # contenu de repli (avec traductions) et registres d'icônes
```

## Démarrer en local

```bash
npm install
cp example.env .env.local      # puis renseigner les variables
npm run db:push                # crée les tables
npm run db:seed                # importe le contenu initial
npm run dev                    # http://localhost:3000
```

Premier accès admin : ouvrir `/admin/setup` (compte = `ADMIN_EMAIL`).

### Scripts utiles

| Commande            | Rôle                                              |
| ------------------- | ------------------------------------------------- |
| `npm run check`     | lint + typecheck                                  |
| `npm run build`     | build de production (inclut `db-sync` sur Vercel) |
| `npm run test:e2e`  | tests Playwright sur le build (`next start`)      |
| `npm run db:sync`   | applique les migrations additives `prisma/sql`    |
| `npm run db:studio` | explorer la base                                  |

## CI/CD — livrer sans casser la prod

1. Chaque push (toutes branches) et chaque PR vers `main` passe par
   **GitHub Actions** (`.github/workflows/ci.yml`) :
   lint → typecheck → **simulation de mise à jour de la base de prod** →
   base de test seedée → build de production → **tests e2e Playwright**.
2. Vercel crée un **déploiement de preview** par branche ; seul `main` part en production.
3. On ne merge dans `main` que lorsque la CI est verte.

### Évolutions de la base de données

Le schéma n'utilise pas `prisma migrate` : les évolutions passent par des fichiers SQL
**additifs et idempotents** dans `prisma/sql/` (règles détaillées dans `prisma/sql/README.md`),
appliqués **une seule fois chacun** grâce au journal `_sql_migrations` (`CREATE TABLE IF NOT EXISTS`, ajout de
colonne avec valeur par défaut…). Ils sont appliqués automatiquement au build Vercel
par `scripts/db-sync.mjs`, avant `next build`.

- Un échec n'interrompt pas le déploiement : le code garde un repli (ex. thème clair
  par défaut si la table du thème n'existe pas).
- En CI, une base est reconstruite **au schéma de `main`**, les migrations y sont
  rejouées, puis `prisma migrate diff --exit-code` exige zéro écart avec le nouveau
  schéma : un changement de schéma sans migration additive fait échouer la CI.
- `SKIP_DB_SYNC=1` désactive l'étape si besoin.

Pour faire évoluer le schéma : modifier `schema.prisma`, générer le SQL avec
`npx prisma migrate diff --from-schema-datamodel <ancien> --to-schema-datamodel prisma/schema.prisma --script`,
le rendre idempotent et l'ajouter sous `prisma/sql/NNN_description.sql`.

## Variables d'environnement

Voir [`example.env`](example.env) : EmailJS, `DATABASE_URL` / `DIRECT_URL`,
`AUTH_SECRET`, WebAuthn, `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL`.

## Contact

- Email : [o.t.bahtoure@gmail.com](mailto:o.t.bahtoure@gmail.com)
- LinkedIn : [linkedin.com/in/bahoumartoure](https://www.linkedin.com/in/bahoumartoure)
- GitHub : [github.com/bahToureOumarToure](https://github.com/bahToureOumarToure)
