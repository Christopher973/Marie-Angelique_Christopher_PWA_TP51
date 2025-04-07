// Script de débogage pour identifier les problèmes d'installation de la PWA

function debugInstallability() {
  // Vérifier le service worker
  const swStatus = navigator.serviceWorker ? "Supporté" : "Non supporté";
  console.log(`Service Worker: ${swStatus}`);

  // Vérifier l'état du manifeste
  fetch("./manifest.json")
    .then((response) => response.json())
    .then((manifest) => {
      console.log("Manifest chargé avec succès");

      // Vérifier les icônes requises
      const requiredSizes = [192, 512];
      const hasRequiredIcons = requiredSizes.every(
        (size) =>
          manifest.icons &&
          manifest.icons.some(
            (icon) => icon.sizes.includes(`${size}x${size}`) && icon.src
          )
      );

      console.log(
        `Icônes requises présentes: ${hasRequiredIcons ? "Oui" : "Non"}`
      );

      // Vérifier si l'icône maskable existe
      const hasMaskable =
        manifest.icons &&
        manifest.icons.some(
          (icon) => icon.purpose && icon.purpose.includes("maskable")
        );

      console.log(`Icône maskable présente: ${hasMaskable ? "Oui" : "Non"}`);

      // Vérifier les autres propriétés importantes
      console.log(`display: ${manifest.display || "Non défini"}`);
      console.log(`start_url: ${manifest.start_url || "Non défini"}`);
      console.log(`theme_color: ${manifest.theme_color || "Non défini"}`);
      console.log(
        `background_color: ${manifest.background_color || "Non défini"}`
      );
    })
    .catch((error) => {
      console.error("Erreur de chargement du manifest:", error);
    });

  // Vérifier chaque icône
  const iconUrls = [
    "./img/icon-192x192.png",
    "./img/icon-512x512.png",
    "./img/maskable-icon.png",
  ];

  iconUrls.forEach((url) => {
    const img = new Image();
    img.onload = () => console.log(`Icône chargée avec succès: ${url}`);
    img.onerror = () =>
      console.error(`ERREUR: Impossible de charger l'icône: ${url}`);
    img.src = url;
  });
}

// Exécuter la vérification après chargement complet
window.addEventListener("load", debugInstallability);
