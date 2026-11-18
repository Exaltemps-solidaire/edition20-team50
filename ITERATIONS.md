# Plan d'itérations

**Plan validé le 2026-11-18.**

- **Source du plan** : proposé par l'agent (aucun plan d'itérations trouvé dans la passation PM Lab — seulement un plan de livraison en 4 objectifs, repris ci-dessous comme ordre de priorité).
- **Temps restant annoncé** : 60 minutes, à 2026-11-18 16:51.
- **Durée du tour de test de l'équipe** : 5 minutes.
- **Capacité estimée** : chaque itération coûte au plus 10 min de codage + ~5 min de publication + 5 min de tour de test = ~20 min. Avec 60 minutes, **3 itérations tiennent, sans marge** si chacune prend ses 10 minutes pleines. ⚠️ Budget tendu : à la moindre dérive, préférer finaliser moins que prévu plutôt que dépasser.
- **Hors périmètre de cette fenêtre de build** (✂️, à reporter après le hackathon ou si du temps se libère) :
  - Vérification de la réparation et clôture du dossier par la référente (objectif 3 du plan de l'équipe).
  - Planning des contrôles (objectif 4 du plan de l'équipe).
  - Tableau de bord général agrégé (terrains, contrôles en retard, réparations en cours).
  - Notifications (référente/RST/prestataire).
  - Persistance réelle (base de données + API) : les incidents restent en mémoire côté front pour cette fenêtre ; limitation à documenter dans `DEPLOIEMENT.md`.
  - Tout ce que la passation écarte déjà : suivi des jeunes, relances automatiques, intégration des rapports des bureaux de contrôle, gestion des droits d'accès, cas juridique "terrain sans convention", statistiques avancées.

---

## Itération 1 : Le squelette est en ligne et montre l'écran « Qui êtes-vous ? » puis la liste des incidents (données en dur)

- **Dans le périmètre** :
  - `.env.example` à la racine et `DEPLOIEMENT.md` (gabarit déjà posé pour `api/` et `frontend/`, routes `/health` et `/sante` déjà présentes).
  - Écran « Qui êtes-vous ? » : liste de personas d'exemple (RST, référente, éducateur sportif, prestataire, directeur), sans connexion ni mot de passe.
  - Une fois un rôle choisi : liste des incidents ouverts, données d'exemple en dur (terrain, équipement, gravité, statut), bouton pour changer de rôle.
- **Hors périmètre** : déclaration d'incident fonctionnelle, qualification, API réelle pour les incidents (ils restent en dur dans le front à ce stade).
- **Critères d'acceptation** :
  - Étant donné l'application déployée, quand on ouvre `/`, alors l'écran « Qui êtes-vous ? » liste au moins RST, référente, éducateur sportif, prestataire.
  - Étant donné un rôle choisi, quand on valide, alors la liste des incidents ouverts (données d'exemple, aucune donnée personnelle réelle) s'affiche avec un bouton pour changer de rôle.
  - Étant donné `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante`, quand le développeur les ouvre dans son navigateur, alors ils répondent 200 avec un corps qui n'est pas la page de réveil.
- **Hypothèse de l'équipe couverte** : aucune directement — cette itération pose le socle sur lequel les hypothèses suivantes se mesureront.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/app/page.tsx`, `frontend/src/app/incidents-exemple.ts` (ou équivalent, données + logique de filtrage), `.env.example`, `DEPLOIEMENT.md`.
- **Tests unitaires prévus** : 1 à 3, sur la fonction qui filtre/étiquette les incidents « ouverts » à partir du jeu de données d'exemple (pas de test sur le balisage pur).
- **Étapes ajoutées à la démo** : ouvrir l'app, choisir le rôle RST, voir la liste des incidents.
- **Bilan** :
  - Codage réalisé en 3 minutes (budget 10 min), sans dépassement.
  - Critère 1 et 2 satisfaits en local : build Next.js (`next build`) réussi, export statique généré avec l'écran « Qui êtes-vous ? » puis la liste des incidents.
  - `npm test` passe (2 tests api existants + 2 tests nouveaux sur `incidents-exemple.ts`).
  - `./scripts/verifier-deployabilite.sh` : aucune borne, aucune alarme.
  - **Déblocage** : l'infra a posé un miroir `mirror.gcr.io` dans `/etc/containers/registries.conf.d/` (17:28) devant `docker.io`, hors du quota anonyme partagé par les VM de l'événement. Rebuild de `api` et `frontend` réussi dès la première tentative après ce changement.
  - Images poussées sur `localhost:5000/team50/{api,frontend}:dev`, déploiement via `podman compose` (services `frontend` 8080, `api` 8081 sur `core-network`).
  - Vérifié depuis la machine : `localhost:8080/` → 200 avec l'écran « Qui êtes-vous ? » et les 5 personas ; `localhost:8080/health`, `localhost:8080/sante`, `localhost:8081/health`, `localhost:8081/sante` → tous 200, corps non-vide (pas la page de réveil).
  - Critère 3 satisfait depuis la machine ; **vérification `$URL_PUBLIQUE/health` et `/sante` dans le navigateur du développeur en attente** (point 5 de la DoD, non bloquant pour le signal).
  - `npm test` repassé (2+2 tests, tous verts) et `./scripts/verifier-deployabilite.sh` : aucune borne, juste avant le signal.
  - **Version 1 signalée à PM Lab** à 17:32 (`./scripts/signaler-version.sh 1`) : `{"numero":1,"url":"https://edition20-team50.exaltemps-space.com", ...}`.
  - Itération close.
  - **Modifications** :
    - `frontend/src/app/incidents-exemple.ts` (nouveau) : données d'exemple (personas, incidents) et logique métier (`incidentsOuverts`, `libelleGravite`, `libelleStatut`) — sert les critères 1 et 2.
    - `frontend/src/app/incidents-exemple.test.ts` (nouveau) : 2 tests sur `incidentsOuverts` et `libelleGravite`.
    - `frontend/src/app/page.tsx` : écran « Qui êtes-vous ? » puis liste des incidents ouverts, remplace le gabarit `create-next-app` — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles de ces deux écrans.
    - `.env.example` (nouveau) : documente `PORT` (api).
    - `DEPLOIEMENT.md` (nouveau) : sert le point 8 du contrat de déployabilité, note la limitation (incidents en dur, pas de persistance).
    - `frontend/Dockerfile`, `api/Dockerfile` : images de base qualifiées en `docker.io/library/…` (exigé par le `/CLAUDE.md` du serveur, sinon la résolution de nom court échoue).
    - `podman-compose.yml` (nouveau, racine) : services `frontend` (8080) et `api` (8081) sur `core-network`, suivant la recette du serveur.

## Itération 2 : Déclarer un incident depuis le formulaire mobile

- **Dans le périmètre** : formulaire de déclaration (terrain, équipement, description courte, niveau de gravité), bouton valider, le nouvel incident apparaît en tête de la liste avec le statut « déclaré ». Pas de persistance serveur : état gardé en mémoire côté app pour cette itération (limitation à noter).
- **Hors périmètre** : photo jointe, notification à la référente/au RST, qualification de la priorité, persistance base de données.
- **Critères d'acceptation** :
  - Étant donné le rôle RST ou éducateur sportif, quand il remplit terrain + équipement + description + gravité et valide, alors l'incident apparaît en tête de la liste des incidents ouverts avec le statut « déclaré ».
  - Étant donné un champ obligatoire vide (terrain ou équipement), quand on valide, alors le formulaire affiche une erreur et ne crée aucun incident.
  - Étant donné qu'on change de rôle puis qu'on revient à la liste (sans recharger la page), quand on consulte les incidents, alors l'incident déclaré précédemment est toujours visible.
- **Hypothèse de l'équipe couverte** : « un formulaire mobile unique permettrait à l'éducateur sportif de déclarer un incident en quelques gestes » (mesure : part des signalements via le canal unique, cible 100 %).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `frontend/src/app/page.tsx` (ou nouveau composant de formulaire), un module de logique métier (validation + ajout d'un incident) et son test.
- **Tests unitaires prévus** : 1 à 3, sur la validation du formulaire (champs obligatoires) et sur la fonction d'ajout (statut initial « déclaré »).
- **Étapes ajoutées à la démo** : remplir le formulaire de déclaration, vérifier que l'incident apparaît dans la liste.
- **Bilan** :
  - **Temps restant annoncé** : 30 minutes, à 2026-11-18 17:37.
  - Codage réalisé en 1 minute (budget 10 min), sans dépassement.
  - Les 3 critères d'acceptation sont satisfaits : formulaire visible pour les rôles RST et éducateur sportif uniquement, erreurs affichées et aucun incident créé si terrain/équipement vides (testé unitairement), incident conservé en changeant de rôle (état porté par le composant `Home`, pas remis à zéro par le changement de persona).
  - `npm test` : 2 (api) + 5 (frontend, 3 nouveaux) tests, tous verts. `./scripts/verifier-deployabilite.sh` : aucune borne.
  - Déployé : rebuild + push de l'image `frontend` uniquement (l'API n'a pas changé), recréation du service via `podman compose`. Vérifié depuis la machine : `localhost:8080/`, `/health`, `/sante` → 200.
  - **Version 2 signalée à PM Lab** à 17:39 (`./scripts/signaler-version.sh 2`).
  - Démo `e2e/demo.spec.ts` complétée (choix du rôle RST, déclaration d'un incident, vérification dans la liste) et rejouée avec succès en local (`BASE_URL=http://localhost:8080`).
  - Rien de reporté dans cette itération.
  - **Modifications** :
    - `frontend/src/app/incidents-exemple.ts` : ajoute `validerDeclaration` (champs obligatoires terrain/équipement) et `declarerIncident` (ajoute en tête, statut `declare`) — sert les critères 1 et 2.
    - `frontend/src/app/incidents-exemple.test.ts` : 3 tests nouveaux sur ces deux fonctions.
    - `frontend/src/app/page.tsx` : formulaire de déclaration affiché pour les rôles `rst`/`educateur`, état des incidents levé dans `Home` (persiste au changement de rôle) — sert les critères 1, 2 et 3.
    - `frontend/src/app/page.module.css` : styles du formulaire et des messages d'erreur.
    - `e2e/demo.spec.ts` : étapes de déclaration ajoutées à la démo (hors DoD).

## Itération 3 : Joindre une photo au signalement

⚠️ **Changement de priorité** : insérée avant l'itération « qualifier/affecter » (qui devient l'itération 4) sur retour des cadreurs pendant le tour de test de la version 2. À valider formellement par l'équipe lors du prochain tour de test.

- **Dans le périmètre** : champ photo optionnel dans le formulaire de déclaration ; la photo choisie est prévisualisée et conservée avec l'incident, affichée (miniature) dans la liste. Version réduite, cohérente avec l'absence de persistance serveur de cette fenêtre de build : la photo est gardée en mémoire côté app (data URL), pas de bucket S3 ni de route API dédiée à ce stade — ce sera repris avec l'itération « persistance réelle ».
- **Hors périmètre** : stockage objet (S3), route API de service d'image, compression/redimensionnement, photo sur le compte-rendu d'intervention (prestataire).
- **Critères d'acceptation** :
  - Étant donné le rôle RST ou éducateur sportif, quand il joint une photo et valide le formulaire, alors l'incident déclaré affiche cette photo dans la liste.
  - Étant donné aucun fichier choisi, quand on valide le formulaire (terrain et équipement remplis), alors l'incident est créé sans photo, sans erreur.
- **Hypothèse de l'équipe couverte** : retour direct des cadreurs (pas dans les hypothèses initiales de la passation) — à documenter si confirmé par l'équipe.
- **Codage estimé** : 5 minutes (budget réduit, 15 minutes restantes au total).
- **Fichiers prévus** : `frontend/src/app/incidents-exemple.ts` (type + fonction), son test, `frontend/src/app/page.tsx`.
- **Tests unitaires prévus** : 1, sur `declarerIncident` avec et sans photo.
- **Étapes ajoutées à la démo** : reporté si le temps manque.
- **Bilan** :
  - **Temps restant annoncé** : 15 minutes, à 2026-11-18 17:53 (annonce initiale de 10 min révisée à 15 min par le développeur).
  - Codage réalisé en 1 minute (budget réduit à 5 min), sans dépassement.
  - Les 2 critères d'acceptation sont satisfaits : photo prévisualisée et affichée en miniature dans la liste quand elle est fournie (testé unitairement sur `declarerIncident`) ; incident créé sans erreur ni photo quand aucun fichier n'est choisi.
  - `npm test` : 2 (api) + 6 (frontend, 1 nouveau) tests, tous verts. `./scripts/verifier-deployabilite.sh` : aucune borne.
  - Déployé : rebuild + push de l'image `frontend` uniquement, recréation du service. Vérifié depuis la machine : `localhost:8080/`, `/health`, `/sante`, `localhost:8081/health` → 200.
  - **Version 3 signalée à PM Lab** à 17:55 (`./scripts/signaler-version.sh 3`).
  - Reporté faute de temps : mise à jour de `e2e/demo.spec.ts` (pas d'étape photo ajoutée à la démo).
  - **Modifications** :
    - `frontend/src/app/incidents-exemple.ts` : `Incident` et `ChampsDeclaration` gagnent `photoDataUrl?: string`, propagé par `declarerIncident` — sert les 2 critères.
    - `frontend/src/app/incidents-exemple.test.ts` : 1 test nouveau (photo conservée quand fournie, absente sinon).
    - `frontend/src/app/page.tsx` : champ `<input type="file">` optionnel, lu en data URL via `FileReader`, aperçu dans le formulaire et miniature dans la liste des incidents — sert les 2 critères.
    - `frontend/src/app/page.module.css` : styles de l'aperçu et de la miniature.

## Itération 4 : Qualifier la priorité et affecter un prestataire

- **Dans le périmètre** : depuis le rôle référente, ouvrir un incident « déclaré », choisir une priorité (urgence sécurité / intervention rapide / intervention programmée) et un prestataire d'exemple avec un délai ; l'incident passe au statut « affecté » et affiche priorité + prestataire dans la liste.
- **Hors périmètre** : avancement du prestataire, vérification RST, clôture, planning des contrôles, notification réelle.
- **Critères d'acceptation** :
  - Étant donné un incident « déclaré » et le rôle référente, quand elle choisit une priorité et un prestataire avec un délai et valide, alors l'incident passe au statut « affecté » et affiche ces informations dans la liste.
  - Étant donné un incident déjà affecté, quand on le consulte à nouveau, alors la priorité et le prestataire restent visibles.
  - Étant donné un rôle autre que référente (RST, éducateur sportif), quand il consulte la liste, alors l'action de qualification/affectation ne lui est pas proposée.
- **Hypothèse de l'équipe couverte** : « chaque dossier ouvert porte une priorité et un prestataire affecté avant clôture ».
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : module de logique métier (transition de statut, contrôle par rôle) et son test, composant/écran de qualification, mise à jour de la liste des incidents.
- **Tests unitaires prévus** : 1 à 3, sur la transition de statut « déclaré » → « affecté » et sur le contrôle d'accès par rôle.
- **Étapes ajoutées à la démo** : qualifier et affecter un prestataire à l'incident déclaré pendant la démo.
- **Bilan** : _à remplir en fin d'itération._

---

## À venir (non détaillé, ordre de priorité de l'équipe)

5. Avancement du prestataire (travaux réalisés, statut « en cours »).
6. Vérification RST et confirmation de remise en service.
7. Clôture du dossier par la référente, historique dans la fiche équipement.
8. Planning des contrôles (équipements à contrôler, enregistrement date/résultat).
9. Tableau de bord général (terrains, incidents ouverts, contrôles en retard, réparations en cours).
10. Persistance réelle (base de données + API) à la place de l'état en mémoire — inclura le stockage réel des photos (S3, route API dédiée).
