# Architecture cible et parcours métier

## Décision de produit

App to mantenimiento est un marketplace de services, de partenaires et de connaissances. Ce n'est pas seulement un outil de gestion interne des interventions. Le client découvre, compare, demande une visite, approuve un devis, suit l'exécution puis valide la livraison. Le professionnel organise ses opportunités et son équipe. La startup pilote la qualité, l'activité et le support.

Le prototype livré est intégralement frontend. Les sections ci-dessous sont une proposition de développement, pas des fonctions backend déjà installées.

## Canaux et responsabilités

| Canal                           | Utilisateur              | Fonctions cibles                                                                                            |
| ------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Landing / pages publiques Astro | Visiteur                 | Proposition de valeur, catégories, villes, contenu éditorial, acquisition                                   |
| Marketplace et espace React     | Client                   | Adresses, disponibilité, demandes, devis, paiement, historique, avis, réclamation                           |
| Portail partenaire React        | Entreprise / indépendant | Équipe, zones, services, tarifs, agenda, devis, intervention, facturation                                   |
| Console React                   | Support humain           | Attribution, SLA, conversations, incidents, contrôle des preuves, escalades                                 |
| Console de direction React      | Startup                  | Offre/demande par zone, qualité, conversion, volume d'affaires et revenu net distincts                      |
| Apps React Native + Expo        | Client / technicien      | API commune, notifications, photos, rendez-vous, progression, mode terrain                                  |
| Olivia                          | Assistance               | Recherche guidée, préqualification, lecture des demandes autorisées, création de ticket et transfert humain |

## Phase 1 : Railway

- Frontend public Astro + React déployable sur Vercel ; espaces applicatifs connectés à la même API versionnée.
- Backend TypeScript conteneurisé (NestJS recommandé si l'audit de ServiceHub confirme la compatibilité ; choix à confirmer après audit du code).
- PostgreSQL comme source de vérité. PostGIS ou calcul de distance qualifié pour couverture, rayon, coordonnées et règles territoriales, après vérification de la disponibilité du service choisi.
- Stockage objet compatible S3 pour les photos, pièces et preuves. Métadonnées en base. URLs de lecture temporaires et contrôles par demande.
- Queue de notifications/travaux asynchrones ; Redis si justifié par la charge et le workflow.
- Authentification, session sécurisée, rôles et permissions côté serveur, isolation par entreprise partenaire, journal d'audit.
- Modèle de paiement à choisir : paiement direct au prestataire ou encaissement via plateforme avec solution marketplace et onboarding des bénéficiaires. Stripe éventuel à qualifier selon pays, entité, disponibilité et obligations ; ne pas appeler cela « séquestre » sans mécanisme contractuel et technique adapté.
- Sauvegardes indépendantes et restaurations testées, supervision, alertes externes, staging séparé.

L'existence de ServiceHub ne prouve pas sa réutilisabilité : audit préalable de l'API, du modèle multi-entreprise, des droits, des fichiers et de la licence. Ne pas recopier une base de clients ou connecter un environnement de production à la démo.

## Phase 2 : VPS2

Même code API et mêmes migrations SQL, conteneurs Docker distincts, reverse proxy TLS, PostgreSQL, stockage et services asynchrones. Migration préparée sans réécrire les applications clientes : domaine API stable et configuration par environnement.

Avant migration : mesurer CPU/RAM/IOPS/espace et dépendances, isoler ce projet des services mail/CRM déjà présents, définir sauvegarde hors serveur et supervision. Procédure : copie initiale, répétition en staging, validation des objets et comptes, fenêtre de bascule, synchronisation finale, test des parcours, retour arrière documenté. La capacité actuelle de VPS2 n'a pas été inspectée dans cette tâche.

## Modèle de données proposé

- Identity : User, Session, Role, Permission, Organization, OrganizationMember.
- Catalogue : Department, Service, ServiceScope, PriceRule, Provider, ProviderDocument, CoverageZone, AvailabilitySlot.
- Client : Household, Address, Asset, MaintenancePlan, Favorite.
- Transaction : ServiceRequest, Quote, QuoteLine, ChangeOrder, Appointment, WorkOrder, Assignment, Evidence, Acceptance, Review.
- Paiements : PaymentIntent, PaymentEvent, Refund, ProviderSettlement, PlatformFee (selon modèle validé).
- Support : Conversation, Message, Ticket, Escalation, AuditEvent.
- Contenu : Course, Lesson, Enrollment, Progress, Article, SupplierCategory, SupplierProfile, PartnerReferral.

Toute ressource privée doit porter ses règles d'accès : propriétaire, entreprise partenaire concernée, technicien affecté et agent support autorisé. Le frontend ne décide jamais seul des autorisations.

## Parcours contractuel et opérationnel cible

1. Recherche par besoin, adresse/zone et créneau.
2. Affichage des prestataires réellement éligibles : spécialité, disponibilité, couverture et contrôles de profil.
3. Demande de diagnostic ou service à prix défini, avec exclusions compréhensibles.
4. Devis détaillé, matériaux, taxes, déplacement, dates et conditions d'annulation.
5. Acceptation du devis et paiement éventuel selon le modèle validé.
6. Affectation de l'équipe, déplacement, intervention et preuves.
7. Tout extra nécessite un avenant accepté avant exécution ; aucune hausse silencieuse.
8. Soumission à validation du client, désaccord éventuel → support, clôture et avis lié à une intervention réelle.

Le prototype simplifie les états : Por confirmar → Confirmada → En camino → En servicio → Por validar → Completada. L'ajout d'une preuve demo est requis avant « Por validar ». La confirmation finale est effectuée dans la vue client. Les annulations, litiges, refus de devis, incidents et remboursements doivent être ajoutés au backend réel avec règles et autorisations.

## Olivia et support humain

Le nom Olivia v5 est une cible d'intégration, pas une capacité démontrée. À auditer : API existante, identité utilisateur, outils autorisés, données minimales, latence, journalisation, rétention et coût. Permissions initiales : chercher le catalogue, lire les demandes du client, préparer une demande, créer un ticket. Les paiements, annulations, remises, changements de devis et autres engagements ne doivent pas être déclenchés sans autorisation explicite et contrôle serveur. Pas de diagnostic autonome dangereux (gaz, structure, électricité).

Dans la démo : réponses déterministes locales et ticket visible dans la console, sans aucun modèle distant ni prestataire contacté.

## États-Unis

Préparer dès le modèle les champs pays, langue, devise, fuseau, unités et règles de couverture. Ne pas effectuer une simple conversion de prix MXN→USD : catalogue, prestataires, fiscalité, licences, assurances, contrats, paiements et support doivent être définis par marché. EN-US / USD et ES-MX / MXN constituent des configurations distinctes. Le lancement US n'est pas activé ici.

## Sources techniques de référence

- Astro React : https://docs.astro.build/en/guides/integrations-guide/react/
- React Native : https://reactnative.dev/
- Expo : https://docs.expo.dev/core-concepts/

Les choix d'architecture ci-dessus sont proposés pour ce projet et n'impliquent aucun abonnement ou service déjà provisionné.
