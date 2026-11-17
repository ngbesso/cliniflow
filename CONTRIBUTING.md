# Contribuer à CliniFlow

Ce document décrit comment le code arrive dans `main`. Il s'applique à tout le monde, sans exception.

## 1. Tout part d'un ticket Jira

Aucun changement sans ticket. Avant de commencer :

1. Choisir un ticket du sprint actif.
2. Le passer à **En cours** dans Jira.
3. Créer la branche à partir de `main` à jour.

## 2. Nommer les branches

Format : `<type>/<CLÉ-JIRA>-<description-courte>`

| Type | Usage | Exemple |
|---|---|---|
| `feature` | Nouvelle fonctionnalité (story) | `feature/CLF-11-connexion` |
| `fix` | Correction de bogue | `fix/CLF-52-priorite-spo2-limite` |
| `chore` | Outillage, configuration, dépendances | `chore/CLF-33-conventions-depot` |
| `refactor` | Restructuration sans changement de comportement | `refactor/CLF-60-extraire-vitalsigns` |
| `docs` | Documentation seule | `docs/CLF-41-guide-api` |

Règles : minuscules, mots séparés par des tirets, pas d'accents.

## 3. Écrire les messages de commit

On suit [Conventional Commits](https://www.conventionalcommits.org/fr/).

Format : `<type>(<portée>): <description> [CLÉ-JIRA]`

```
feat(triage): calculer la priorité à partir des signes vitaux [CLF-18]
fix(auth): bloquer la connexion après 5 échecs [CLF-11]
test(queue): couvrir le départage des priorités égales [CLF-22]
chore(ci): ajouter le job Larastan [CLF-37]
```

- **Types** : `feat`, `fix`, `test`, `refactor`, `docs`, `chore`, `style`, `perf`
- **Portée** : le périmètre fonctionnel (`auth`, `patient`, `triage`, `queue`, `lab`, `audit`) ou technique (`ci`, `docker`, `deps`)
- **Description** : à l'impératif, en minuscules, sans point final, 72 caractères maximum
- **Clé Jira** : obligatoire. C'est elle qui relie le commit au ticket.

Un commit = un changement cohérent. On préfère plusieurs petits commits à un gros commit « divers ».

## 4. Ouvrir une pull request

1. Pousser la branche et ouvrir une PR vers `main`.
2. Titre de la PR : même format qu'un commit (il deviendra le commit fusionné).
3. Remplir le modèle de PR, en entier.
4. Passer le ticket Jira à **En revue**.

## 5. Revue et fusion

- La CI doit être verte : la fusion est bloquée sinon.
- Relire sa propre PR avec la checklist du modèle, comme si quelqu'un d'autre l'avait écrite.
- Fusionner en **Squash and merge** : un ticket = un commit dans `main`, historique linéaire.
- Supprimer la branche après la fusion.
- Passer le ticket Jira à **Terminé**, uniquement si la Definition of Done est respectée.

## 6. Ce qui est interdit sur `main`

- Pousser directement (tout passe par une PR)
- Forcer un push (`git push --force`)
- Supprimer la branche

Ces règles sont appliquées automatiquement par la protection de branche.
