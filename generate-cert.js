const { execSync } = require("child_process");
const fs = require("fs");

// Vérifier si mkcert est installé
try {
  console.log("Tentative de génération de certificats avec Node.js...");

  // Création d'un simple script pour générer le certificat
  const selfsigned = require("selfsigned");
  const attrs = [{ name: "commonName", value: "localhost" }];
  const pems = selfsigned.generate(attrs, { days: 365 });

  fs.writeFileSync("cert.pem", pems.cert);
  fs.writeFileSync("key.pem", pems.private);

  console.log("✅ Certificats générés avec succès!");
} catch (e) {
  console.log("Erreur lors de la génération des certificats:", e.message);

  console.log("\nInstallation du module nécessaire...");
  try {
    execSync("npm install selfsigned", { stdio: "inherit" });
    console.log("Module installé, veuillez relancer le script.");
  } catch (e) {
    console.error("Erreur lors de l'installation du module:", e.message);
  }
}
