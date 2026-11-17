# ---------------------------------------------------------------
# Image PHP de l'API CliniFlow
# Une image = une recette figée. Chaque instruction crée une couche
# mise en cache : on place en haut ce qui change rarement.
# ---------------------------------------------------------------

# 1. Image de base officielle : PHP 8.5 avec PHP-FPM (le serveur
#    qui exécute PHP derrière Nginx). Variante Debian (stable).
FROM php:8.5-fpm

# 2. Paquets système nécessaires aux extensions PHP.
#    On nettoie le cache apt dans la même instruction pour garder
#    une couche légère.
RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libicu-dev \
        libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. Extensions PHP dont Laravel et notre projet ont besoin :
#    - pdo_mysql : connexion à MySQL
#    - intl      : formats de dates et de nombres en français
#    - zip       : utilisé par Composer
#    - pcntl     : arrêt propre des workers de file d'attente
RUN docker-php-ext-install pdo_mysql intl zip pcntl

# 4. Extension Redis (non incluse dans PHP) : installée via PECL.
RUN pecl install redis \
    && docker-php-ext-enable redis

# 5. Composer, copié depuis son image officielle (build multi-étapes) :
#    pas besoin de le télécharger ni de l'installer à la main.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 6. Utilisateur non root, avec le même UID/GID que toi sur ta machine.
#    Sans ça, les fichiers créés dans le conteneur (par Composer ou
#    Artisan) appartiennent à root et tu ne peux plus les modifier.
ARG UID=1000
ARG GID=1000
RUN groupadd --gid ${GID} app \
    && useradd --uid ${UID} --gid ${GID} --create-home app

# 7. Dossier de travail : c'est là que le code sera monté.
WORKDIR /var/www/backend

USER app

# PHP-FPM écoute sur le port 9000 ; seul Nginx lui parle.
EXPOSE 9000
CMD ["php-fpm"]
