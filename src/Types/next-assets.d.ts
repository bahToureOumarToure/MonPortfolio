// Permet un `tsc --noEmit` autonome (CI) sans dépendre du next-env.d.ts
// généré au build : déclare les types Next et les imports d'images statiques.
/// <reference types="next" />
/// <reference types="next/image-types/global" />
