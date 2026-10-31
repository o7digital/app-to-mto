# App to mantenimiento

Prototype de marketplace de maintenance résidentielle pour le Mexique. Nom de travail choisi par Olivier et Victor. Interface en espagnol mexicain, montants de démonstration en MXN. L'expansion aux États-Unis est prévue au cadrage, pas activée dans le prototype.

## Lancer

Prérequis : Node.js 22 (22.13 minimum) et pnpm 11.25.0.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm build
pnpm preview
```

Astro 5 + React 19 + TypeScript, sortie statique `dist/`. Les versions exactes sont consignées dans `pnpm-lock.yaml`. Le fichier `pnpm-workspace.yaml` autorise uniquement les scripts d'installation de `esbuild` et `sharp`.

## Ce qui fonctionne dans le prototype

- Marketplace : 14 départements, catalogue, recherche accent-insensible, filtres de zone et disponibilité, tri.
- Répertoire de professionnels par catégorie et zone.
- Fiche de service avec contenu de visite, exclusions, prix de référence et durée.
- Réservation en 3 étapes, date et horaire souhaités, adresse fictive et observations.
- Liste de services à comparer, favoris, demandes et suivi conservés dans le navigateur.
- Vues client, partenaires, opérations et support utilisant les mêmes demandes locales.
- Affectation de technicien, progression des états, ajout d'une preuve de démonstration et validation finale côté client.
- Olivia : dialogue scénarisé, orientation du catalogue et création locale de ticket de support.
- Académie : 3 cours de présentation, leçons et progression locale.
- Magazine : articles de présentation avec lecture complète.
- Landing de lancement avec formulaires de démonstration.
- Prévisualisation mobile client/technicien et interface responsive.
- Export CSV des demandes de démonstration.

## Navigation directe

Les vues partagent une seule page Astro et un hash de navigation : `/#home`, `/#catalog`, `/#directory`, `/#academy`, `/#magazine`, `/#launch`, `/#client`, `/#partner`, `/#operations`, `/#mobile`.

## Limites explicites

Il s'agit d'un prototype frontend, pas d'un service de production. Aucun compte réel, contrôle d'accès, API Railway, paiement, géolocalisation GPS, réservation fournisseur, notifications, application native, IA connectée ou vérification de prestataire n'est implémenté. Les rôles sont librement explorables. Les formulaires de lancement ne transmettent rien. Ne pas y saisir de données personnelles réelles.

Les données persistées utilisent la clé `atm-demo-v1` de localStorage. Menu de pied de page « Acerca de esta demo » → « Restablecer datos de demostración » pour réinitialiser. La démo fonctionne en mémoire si le stockage local est indisponible.

## Structure

- `src/pages/index.astro` : document, métadonnées, polices et hydratation React.
- `src/components/App.tsx` : vues, interactions et état partagé du prototype.
- `src/data/catalog.ts` : catégories, catalogue et contenus de démonstration.
- `src/styles/global.css` : système visuel et responsive.
- `public/images/` : deux photographies conceptuelles générées pour le projet.
- `docs/ARCHITECTURE.md` : phase 1 Railway, phase 2 VPS2, modèle produit et séparation des responsabilités.
- `docs/CODEX_HANDOFF.md` : instructions concrètes pour continuer le développement.
- `docs/BRAND_AND_SCOPE.md` : périmètre, noms possibles et hypothèses à valider avec Victor.
- `docs/QA.md` : vérifications effectuées et limites.

## Déploiement sur Vercel

Le dépôt GitHub est https://github.com/o7digital/app-to-mto. Le projet Vercel dédié est `app-to-mto`, dans l'équipe `olivier-steineur`, séparé de DIICSA. `vercel.json` configure Astro, `pnpm install --frozen-lockfile`, `pnpm build` et la sortie `dist`. La version Node est fixée à 22 dans `package.json`.

Pour déployer depuis un checkout autorisé, lier uniquement ce projet puis lancer :

```bash
vercel link --yes --project app-to-mto --scope olivier-steineur
vercel deploy --prod --yes --scope olivier-steineur --build-env ENABLE_EXPERIMENTAL_COREPACK=1
```

Le drapeau de build active Corepack pour respecter `pnpm@11.25.0`. Aucune clé secrète applicative n'est requise. `.vercel/`, `.env*`, les dépendances et les builds sont exclus de Git. Le ZIP livré ne contient ni `.openai` ni identité de Site, ni secrets, ni `node_modules`.

Le projet actuellement prévisualisé est indépendant de l'ancien site. Le NDA est livré séparément, hors des fichiers publics.

## Assets

Deux images créées avec l'outil intégré de génération d'images : `home-service.png` (professionnelle dans un intérieur mexicain) et `services-grid.png` (plomberie, peinture, électricité et jardinage). Ce sont des illustrations conceptuelles, pas les photographies de prestataires réels. Polices DM Sans et Manrope intégrées localement via Fontsource ; icônes Lucide.
