# Raccourcis pour les commandes Docker les plus fréquentes.
# Usage : make up, make sh, make logs…

.PHONY: up down build sh logs ps

up:      ## Démarrer l'environnement
	docker compose up -d

down:    ## Arrêter l'environnement (les données MySQL sont conservées)
	docker compose down

build:   ## Reconstruire l'image PHP (après une modification du Dockerfile)
	docker compose build app

sh:      ## Ouvrir un terminal dans le conteneur PHP
	docker compose exec app bash

logs:    ## Suivre les journaux de tous les services
	docker compose logs -f

ps:      ## Voir l'état des services
	docker compose ps
