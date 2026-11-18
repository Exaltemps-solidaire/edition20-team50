# Déploiement

Suivi centralisé des terrains et des incidents pour **Sport dans la Ville** :
déclarer un incident sur un équipement, le qualifier, l'affecter à un
prestataire et suivre sa réparation jusqu'à la remise en service.

## Services

- `frontend/` : export statique Next.js servi par nginx, port 80 (conteneur) / **8080** sur la VM.
  C'est le service exposé au public ; il porte aussi `/health` et `/sante`.
- `api/` : Node sans dépendance, port **8081**. Pour l'instant ne répond qu'à `/health` et `/sante` :
  aucune route métier n'est branchée (les incidents sont en dur dans le front).

## Services externes appelés

Aucun pour l'instant : pas de base de données, pas d'appel LLM, pas d'e-mail.

## Fragile ou inachevé

- Les incidents affichés sont des **données d'exemple en dur** dans
  `frontend/src/app/incidents-exemple.ts`, remises à zéro à chaque rechargement de page : aucune
  déclaration, qualification ni persistance réelle pour l'instant.
- Pas de connexion entre le front et l'API : `api/` est déployé mais inutilisé par cette version.

## Contact

Équipe 50 (hackathon eXaltemps Solidaire) ; côté association, Sport dans la Ville (voir `passation/`).
