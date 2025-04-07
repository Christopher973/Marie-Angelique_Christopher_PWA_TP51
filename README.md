# Convertisseur de Températures - Progressive Web App

Une application web progressive (PWA) simple et efficace pour convertir des températures entre les échelles Celsius, Fahrenheit et Kelvin. Cette application fonctionne en ligne et hors connexion.

## Fonctionnalités

- Conversion rapide entre Celsius, Fahrenheit et Kelvin
- Interface utilisateur intuitive et responsive
- Fonctionne hors ligne grâce à la technologie PWA
- Installable sur appareils mobiles et ordinateurs de bureau
- Affichage des formules de conversion pour référence

## Prérequis

- Un navigateur web moderne supportant les PWA (Chrome, Edge, Firefox, Safari)
- Pour le développement : Node.js et npm

## Installation pour le développement

1. Clonez ce dépôt sur votre machine locale
2. Naviguez vers le répertoire du projet
3. Installez les dépendances :

```bash
npm install
```

4. Générez des certificats SSL pour le développement local :

```bash
node generate-cert.js
```

5. Générez le service worker avec Workbox :

```
npm run build
```

6. Lancez le serveur local HTTPS :

```
npm start
```

## Comment utiliser l'application

1. Entrez une valeur numérique dans le champ de température
2. Sélectionnez l'unité de départ (Celsius, Fahrenheit ou Kelvin)
3. Sélectionnez l'unité cible pour la conversion
4. Cliquez sur le bouton "Convertir"
5. Le résultat s'affichera dans la zone prévue à cet effet

## Installation de l'application sur votre appareil

Cette application est une Progressive Web App, ce qui signifie qu'elle peut être installée comme une application native sur votre appareil :

### Sur un ordinateur (Chrome, Edge) :

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur l'icône d'installation dans la barre d'adresse ou utilisez le bouton "Installer" dans l'application
3. Suivez les instructions à l'écran

### Sur un appareil mobile :

1. Ouvrez l'application dans votre navigateur
2. Sur Android : un message vous proposera d'ajouter l'application à l'écran d'accueil
3. Sur iOS : appuyez sur "Partager" puis "Sur l'écran d'accueil"

## Fonctionnement hors ligne

Une fois installée, l'application fonctionne entièrement hors ligne. Si vous tentez d'accéder à l'application sans connexion internet, une page hors ligne s'affichera avec les formules de conversion disponibles.

## Structure du projet

- `index.html` - Page principale de l'application
- `offline.html` - Page affichée en mode hors ligne
- `style.css` - Styles de l'application
- `script.js` - Logique principale de l'application
- `sw-custom.js` - Service worker personnalisé utilisant Workbox
- `sw.js` - Service Worker pour le fonctionnement hors ligne
- `manifest.json` - Manifeste pour l'installation en tant que PWA
- `debug-install.js` - Script de débogage pour l'installation
- `generate-cert.js` - Script pour générer des certificats SSL
- `workbox-config.js` - Configuration de Workbox

## Gestion du cache avec Workbox

L'application utilise différentes stratégies de mise en cache selon le type de ressource :

- Pages HTML : Stratégie "NetworkFirst" avec un délai d'attente de 3 secondes. En cas d'échec du réseau, la page est servie depuis le cache.
- Ressources statiques (CSS, JS, images) : Stratégie "StaleWhileRevalidate" qui affiche la version en cache tout en mettant à jour en arrière-plan.
- Navigation : Stratégie "NetworkFirst" qui tente d'abord de récupérer la page fraîche depuis le serveur.
- Hors ligne : Une page personnalisée (offline.html) est affichée si l'utilisateur n'a pas de connexion.

## Technologies utilisées

- HTML5, CSS3 et JavaScript vanilla
- Progressive Web App (PWA)
- Workbox pour la gestion avancée du service worker et du cache
- Service Workers pour le - fonctionnement hors ligne
- Web App Manifest pour l'installation sur les appareils
