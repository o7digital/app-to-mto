# Vérification de livraison

## Reprise du ZIP — 31 octobre 2026

- Installation avec le lockfile figé : pnpm 11.25.0.
- `pnpm check` et `pnpm build` réussis avec Node 22.23.4.
- Vérification navigateur automatisée dans Chrome : recherche accent-insensible, favoris persistants, réservation avec données fictives, persistance après rechargement et lecture dans les vues client et partenaire.
- Affectation d'un technicien, progression jusqu'à En servicio, blocage sans preuve, ajout de preuve, passage Por validar et validation finale uniquement dans la vue client.
- Escalade Olivia et présence du ticket dans les opérations ; progression d'une leçon, lecture d'un article et fiche fournisseur filtrée.
- Les dix vues par hash contrôlées à 390, 768 et 1440 px : aucun débordement horizontal, aucune erreur applicative détectée dans la console.
- Inspection visuelle des captures de la marketplace desktop et mobile ; les deux images et les métadonnées locales répondent correctement.

Ces contrôles portent sur le prototype local. Les contrôles de la livraison d'origine sont conservés ci-dessous. Les limites du prototype restent applicables.

## Contrôles exécutés

- Compilation TypeScript sans émission et build statique Astro réussis.
- Inspection visuelle du marketplace desktop et de la console opérations.
- Inspection visuelle du marketplace à 390 px dans un iframe de contrôle navigateur : header, hero et navigation adaptés ; aucun débordement horizontal du document (largeur utile 375 px avec scrollbar).
- Recherche mobile « electricidad » : un résultat correspondant.
- Réservation complète d'une visite plomberie de démonstration, montant de référence 490 MXN, avec adresse fictive.
- Persistance de la demande après rechargement.
- Lecture de la même demande dans les portails client, partenaire et opérations.
- Affectation du technicien, acceptation, passage En camino puis En servicio.
- Blocage du passage Por validar tant qu'aucune preuve demo n'est ajoutée.
- Ajout d'une preuve conceptuelle, demande de validation, validation finale par le client, état Completada.
- Escalade Olivia vers un ticket de support ; ticket retrouvé dans la console opérations.
- Répertoire : filtre matériaux/équipements + Albañilería ; fiche du fournisseur de démonstration ouverte.
- Académie : ouverture d'un cours, validation d'une leçon et progression vers la suivante.
- Magazine : ouverture et lecture complète d'un article.
- Sources TypeScript/React et assets livrés avec lockfile.

## Limites de vérification

Tests de parcours dans un navigateur desktop et viewport mobile intégré ; pas de test sur appareil physique ni de build natif iOS/Android. Les contrôles de rôle du mockup illustrent des actions d'interface et ne constituent pas une sécurité serveur. Aucune API, transaction financière, géolocalisation GPS, notification ou connexion à Olivia réelle n'a été testée, car elles ne font pas partie de cette démo.

Les erreurs observées du navigateur provenaient de son extension de métadonnées ; aucune erreur applicative n'a été identifiée dans les parcours contrôlés. La page temporaire de contrôle responsive a été supprimée de la livraison.
