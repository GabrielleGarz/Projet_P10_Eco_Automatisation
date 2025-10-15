const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    apiUrl: "http://localhost:8081",
    authToken: null, // Pour stocker le token lors de la connexion
  },
  e2e: {
    setupNodeEvents(on, config) {
      // Tu peux ajouter ici des hooks pour reporter ou custom commands si besoin
      return config;
    },
    baseUrl: "http://localhost:4200/",
    // Optionnel : augmenter le timeout global pour éviter les erreurs de timeout
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 60000,
  },
});

