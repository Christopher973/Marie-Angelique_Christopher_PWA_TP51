const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Génération du service worker avec Workbox...");

// Vérifier si sw-custom.js existe
if (!fs.existsSync("sw-custom.js")) {
  console.error("❌ Le fichier sw-custom.js est manquant!");
  process.exit(1);
}

// Exécuter workbox pour générer le service worker
try {
  console.log(
    "Exécution de la commande: workbox injectManifest workbox-config.js"
  );
  execSync("npx workbox-cli injectManifest workbox-config.js", {
    stdio: "inherit",
  });
  console.log("✅ Service worker généré avec succès!");
} catch (error) {
  console.error(
    "❌ Erreur lors de la génération du service worker:",
    error.message
  );
  process.exit(1);
}
