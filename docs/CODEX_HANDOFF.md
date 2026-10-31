# Instructions pour Codex — reprise du projet

Tu reprends App to mantenimiento, un NOUVEAU projet de marketplace. Ne réutilise pas le nom DIICSA Tu Casa ou DIICSA App, et ne remplace pas son site Vercel sans instruction d'Olivier.

## Première exécution

1. Lire README, ARCHITECTURE et BRAND_AND_SCOPE.
2. Installer avec `pnpm install --frozen-lockfile` et Node 22.13+.
3. Lancer `pnpm dev`, puis ouvrir le site. Valider le responsive avant de changer la direction graphique.
4. Le prototype conserve les données dans localStorage (`atm-demo-v1`). Aucune donnée réelle ne doit y être introduite.
5. Préserver l'identité visuelle : vert profond #153e35, orange #f68442, fonds ivoire, Manrope pour les titres, DM Sans pour les textes. Réutiliser les deux assets locaux. Ne pas remplacer la marketplace par une simple landing de cartes génériques.

## Déploiement du mockup sur Vercel

Créer un dépôt/projet distinct, framework Astro, build `pnpm build`, répertoire `dist`. Le ZIP de livraison exclut la configuration de l'hébergeur de prévisualisation, son identité, ses secrets et les dépendances. Le site est autonome. Les routes du mockup sont des hashes (`/#launch`, `/#client`, etc.).

## Étape suivante à cadrer avec Olivier et Victor

- Confirmer le modèle économique et le rôle juridique de la plateforme : simple mise en relation ou responsabilité plus étendue. Pas de commission/prix inventé.
- Définir la zone pilote, les métiers de lancement et les critères de vérification des prestataires.
- Identifier les partenaires existants et les prospects séparément ; aucune revendication d'affiliation COPARMEX, ARRIBA ou organisme public sans accord.
- Faire compléter et signer le NDA livré séparément. Le contrat de développement devra définir prix, livrables, propriété intellectuelle, licence des composants antérieurs, exploitation, données et sortie.
- Auditer ServiceHub et Olivia avant toute estimation de réutilisation. Ne pas exposer de clé API dans Astro ou React.

## Découpage technique pour passer du mockup au produit

1. Extraire le monocomposant de démonstration en layouts, composants métier et pages/routes : Marketplace, Catalog, ServiceDetail, BookingFlow, ClientPortal, PartnerPortal, OperationsConsole, Academy, Magazine, Launch et MobilePreview.
2. Remplacer le store local par une couche `api` typée, conserver fixtures et mode démonstration isolé.
3. Mettre en place une API versionnée `/v1`, schémas validés, erreurs structurées et migrations SQL ; isoler dev/staging/prod.
4. Authentification sécurisée et RBAC côté serveur avant données privées. L'utilisateur ne choisit pas son rôle réel avec un simple bouton.
5. Catalogue, offres par prestataire, couverture, disponibilité et devis. Une réservation doit empêcher les conflits de créneaux, gérer les fuseaux et conserver le prix accepté.
6. Workflow d'intervention avec transitions autorisées, pièces/photos, notification, validation, annulation et litige ; chaque action auditable.
7. Paiements réels uniquement après décision commerciale et validation du fournisseur pour MX puis US. Webhooks signés, idempotence et réconciliation.
8. Module de contenu administrable pour cours, tips, revue et fournisseurs, avec droits d'édition et modération.
9. Olivia : connecter les outils minimum et l'escalade humaine avec autorisations précises. Aucune autonomie financière implicite.
10. Apps iOS/Android avec React Native + Expo : partager les types/API et les règles métier ; ne pas présenter le site responsive comme deux applications natives déjà livrées. Prévoir caméra, notifications, état hors connexion et synchronisation contrôlée pour les équipes.
11. Phase 1 Railway, phase 2 VPS2 selon ARCHITECTURE. Les apps gardent le même domaine API stable.

## Critères d'acceptation prioritaires

- Un client ne peut lire ni modifier les demandes d'un autre client.
- Un partenaire n'accède qu'à son entreprise et à ses interventions autorisées.
- Un technicien ne valide pas la réception à la place du client.
- Un prix/extra n'est pas modifié après acceptation sans nouvel accord traçable.
- Une réservation ne devient pas confirmée uniquement parce que l'interface a affiché un succès.
- Un paiement n'est pas marqué payé avant preuve serveur vérifiée.
- Une note publique correspond à une intervention réelle autorisée.
- Les notifications sont dédupliquées ; un échec laisse un état exploitable.
- La restauration de sauvegarde et le retour arrière de migration sont testés.

## Vérification de la démo

`node node_modules/typescript/bin/tsc --noEmit` puis `pnpm build`. Tester manuellement : filtrage, réservation, favoris, persistance après recharge, lecture dans les rôles, progression technicien, validation client, ticket Olivia, leçons, articles et affichage mobile. Voir QA.md pour les contrôles réalisés lors de la livraison.
