// Variables globales
let deferredPrompt = null;
const MAX_INSTALL_REFUSALS = 5;

// Fonction qui s'exécute une fois que le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  console.log("PWA Debug: DOM chargé");
  // Éléments du DOM
  const temperatureInput = document.getElementById("temperature-input");
  const fromUnit = document.getElementById("from-unit");
  const toUnit = document.getElementById("to-unit");
  const convertButton = document.getElementById("convert-button");
  const resultValue = document.getElementById("result-value");
  const installBanner = document.getElementById("install-banner");
  const installButton = document.getElementById("install-button");
  const closeBannerButton = document.getElementById("close-banner");

  // Initialisation
  checkIfInstalled();
  setupEventListeners();

  // Configuration des écouteurs d'événements pour l'application
  function setupEventListeners() {
    // Événement de conversion de température
    convertButton.addEventListener("click", convertTemperature);
    temperatureInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        convertTemperature();
      }
    });

    // Événements pour le bandeau d'installation
    installButton.addEventListener("click", installApp);
    closeBannerButton.addEventListener("click", dismissInstallBanner);

    // Écoute l'événement beforeinstallprompt pour capturer l'invite d'installation
    window.addEventListener("beforeinstallprompt", (event) => {
      console.log("PWA Debug: beforeinstallprompt déclenché");
      // Empêche l'affichage automatique de l'invite d'installation
      event.preventDefault();
      // Stocke l'événement pour une utilisation ultérieure
      deferredPrompt = event;
      // Vérifie si l'utilisateur a déjà refusé l'installation trop de fois
      checkInstallRefusals();
    });

    // Vérifier si les critères sont remplis
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("PWA Debug: Service Worker et Push API supportés");
    }

    // Détecte si l'application est déjà installée
    window.addEventListener("appinstalled", (event) => {
      console.log("PWA installée avec succès");
      hideInstallBanner();
      localStorage.removeItem("installRefusals");
    });
  }

  // Vérifier si l'application est installée et ajuster l'interface en conséquence
  function checkIfInstalled() {
    // Vérifie si l'application est lancée en tant que PWA installée
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      document.body.classList.add("installed-pwa");
      hideInstallBanner();
    } else {
      // Si pas installée, vérifie l'historique des refus d'installation
      checkInstallRefusals();
    }
  }

  // Vérifie combien de fois l'utilisateur a refusé l'installation
  function checkInstallRefusals() {
    const refusals = localStorage.getItem("installRefusals") || 0;

    // Si l'événement deferredPrompt existe et que l'utilisateur n'a pas trop refusé
    if (deferredPrompt && refusals < MAX_INSTALL_REFUSALS) {
      showInstallBanner();
    }
  }

  // Affiche le bandeau d'installation
  function showInstallBanner() {
    installBanner.style.display = "flex";
  }

  // Cache le bandeau d'installation
  function hideInstallBanner() {
    installBanner.style.display = "none";
  }

  // Lance l'invite d'installation de la PWA
  function installApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Utilisateur a accepté l'installation");
          localStorage.removeItem("installRefusals");
        } else {
          console.log("Utilisateur a refusé l'installation");
          incrementInstallRefusals();
        }
        deferredPrompt = null;
      });
    }
  }

  // Incrémente le compteur de refus d'installation
  function incrementInstallRefusals() {
    let refusals = parseInt(localStorage.getItem("installRefusals") || "0");
    refusals++;
    localStorage.setItem("installRefusals", refusals);
  }

  // Ferme le bandeau d'installation et incrémente le compteur de refus
  function dismissInstallBanner() {
    hideInstallBanner();
    incrementInstallRefusals();
  }

  // Fonction de conversion de température
  function convertTemperature() {
    const value = parseFloat(temperatureInput.value);

    // Vérifie si la valeur entrée est un nombre valide
    if (isNaN(value)) {
      resultValue.textContent = "Veuillez entrer une valeur numérique";
      return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    // Même unité de départ et d'arrivée
    if (from === to) {
      resultValue.textContent = `${value} ${getUnitSymbol(to)}`;
      return;
    }

    // Effectue la conversion appropriée
    let result;
    switch (true) {
      case from === "celsius" && to === "fahrenheit":
        result = celsiusToFahrenheit(value);
        break;
      case from === "celsius" && to === "kelvin":
        result = celsiusToKelvin(value);
        break;
      case from === "fahrenheit" && to === "celsius":
        result = fahrenheitToCelsius(value);
        break;
      case from === "fahrenheit" && to === "kelvin":
        result = fahrenheitToKelvin(value);
        break;
      case from === "kelvin" && to === "celsius":
        result = kelvinToCelsius(value);
        break;
      case from === "kelvin" && to === "fahrenheit":
        result = kelvinToFahrenheit(value);
        break;
      default:
        result = value;
    }

    // Affiche le résultat avec l'unité
    resultValue.textContent = `${value} ${getUnitSymbol(
      from
    )} = ${result.toFixed(2)} ${getUnitSymbol(to)}`;
  }

  // Obtenir le symbole de l'unité de température
  function getUnitSymbol(unit) {
    switch (unit) {
      case "celsius":
        return "°C";
      case "fahrenheit":
        return "°F";
      case "kelvin":
        return "K";
      default:
        return "";
    }
  }

  // Fonctions de conversion
  function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  function celsiusToKelvin(celsius) {
    return celsius + 273.15;
  }

  function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
  }

  function fahrenheitToKelvin(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9 + 273.15;
  }

  function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }

  function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9) / 5 + 32;
  }
});
