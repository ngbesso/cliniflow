# Raccourcis pour les commandes du projet. Usage : make <cible>
# « make help » liste toutes les cibles.

.PHONY: help up down build sh logs ps hooks format lint analyse test quality

help:     ## Afficher cette aide
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

# --- Environnement --------------------------------------------
up:       ## Démarrer l'environnement (avec le front)
	docker compose --profile front up -d

down:     ## Arrêter l'environnement (les données MySQL sont conservées)
	docker compose --profile front down

build:    ## Reconstruire l'image PHP
	docker compose build app

sh:       ## Ouvrir un terminal dans le conteneur PHP
	docker compose exec app bash

logs:     ## Suivre les journaux de tous les services
	docker compose logs -f

ps:       ## Voir l'état des services
	docker compose ps

hooks:    ## Activer les hooks Git du projet (une seule fois après le clone)
	git config core.hooksPath .githooks

# --- Qualité ---------------------------------------------------
format:   ## Corriger automatiquement le style (back et front)
	docker compose exec -T app ./vendor/bin/pint
	docker compose run --rm -T front npm run format

lint:     ## Vérifier le style sans rien modifier
	docker compose exec -T app ./vendor/bin/pint --test
	docker compose run --rm -T front npm run format:check
	docker compose run --rm -T front npm run lint

analyse:  ## Analyse statique : Larastan, Deptrac, TypeScript
	docker compose exec -T app ./vendor/bin/phpstan analyse --memory-limit=1G
	docker compose exec -T app ./vendor/bin/deptrac analyse --no-progress
	docker compose run --rm -T front npm run typecheck

test:     ## Lancer tous les tests (back et front)
	docker compose exec -T app ./vendor/bin/pest
	docker compose run --rm -T front npm run test:run

quality: format lint analyse test ## Tout vérifier, comme le fera la CI
