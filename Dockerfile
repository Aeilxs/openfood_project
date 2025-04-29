# Étape 1 : Builder avec libsqlite3-dev
FROM gcc:13 AS builder
WORKDIR /build

# Installer les headers nécessaires à SQLite
RUN apt-get update && apt-get install -y libsqlite3-dev

# Compiler le binaire C
COPY scripts/import.c .
RUN gcc import.c -o import -lsqlite3

# Étape 2 : Image finale avec Node + runtime SQLite
FROM node:20

WORKDIR /app

# Installer sqlite3 (runtime seulement)
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Copier backend et scripts
COPY server/ server/
COPY scripts/ scripts/

# Ajouter le binaire compilé depuis le builder
COPY --from=builder /build/import scripts/import

# Rendre les scripts exécutables
RUN chmod +x scripts/*.sh scripts/import scripts/install.sh

# Installer les dépendances backend
RUN cd server && npm install

# Lancer l'installation de la DB
RUN ./scripts/install.sh

# Exposer le port de l'API
EXPOSE 3000

# Commande de lancement
CMD ["npm", "--prefix", "server", "run", "start:dev"]
