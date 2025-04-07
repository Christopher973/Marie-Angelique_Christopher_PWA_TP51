module.exports = {
  // Dossier racine à analyser pour trouver les fichiers à mettre en cache
  globDirectory: "./",

  // Patterns pour les fichiers à mettre en cache automatiquement
  globPatterns: [
    "*.{html,css,js}",
    "manifest.json",
    "img/*.{png,svg,jpg,jpeg}",
  ],

  // Exclure les fichiers node_modules et les fichiers temporaires
  globIgnores: [
    "node_modules/**/*",
    "workbox-*.js",
    "sw.js",
    "build-sw.js",
    "package*.json",
    "*.pem",
  ],

  // Chemin du service worker source personnalisé
  swSrc: "sw-custom.js",

  // Chemin de sortie du service worker généré
  swDest: "sw.js",
};
