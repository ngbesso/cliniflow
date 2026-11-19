# CliniFlow

[![CI](https://github.com/ngbesso/cliniflow/actions/workflows/ci.yml/badge.svg)](https://github.com/ngbesso/cliniflow/actions/workflows/ci.yml)

Plateforme de triage et de suivi des patients à l'urgence : priorisation automatique (P1 à P5), file d'attente des médecins, import des résultats de laboratoire depuis un DME simulé et journal d'audit.

> Projet d'apprentissage. Toutes les données sont fictives et les règles de triage n'ont aucune valeur clinique.

## Stack

| Couche | Technologies |
|---|---|
| Back-end | PHP 8.5, Laravel 13, Clean Architecture par feature |
| Front-end | React 19, TypeScript, Vite, TanStack Query, Tailwind CSS |
| Données | MySQL 8.4, Redis (Elasticsearch en phase 2) |
| Qualité | Pest, Vitest, Playwright, Postman/Newman, Larastan, Deptrac, Pint, ESLint |
| Livraison | Docker Compose, GitHub Actions, AWS (phase finale) |

## Structure du dépôt

```
cliniflow/
├── backend/     API Laravel
├── frontend/    Application React
├── docs/        Documentation (backlog, décisions, schémas)
└── .github/     Modèles de PR et workflows CI
```

## Démarrage

Les instructions arrivent avec la tâche CLF-34 (Docker Compose).

## Contribuer

Le flux de travail (branches, commits, pull requests) est décrit dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Gestion de projet

Backlog et sprints suivis dans Jira, projet `CLF`. Chaque branche, commit et pull request référence une clé de ticket.
