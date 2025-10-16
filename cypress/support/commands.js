// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
    username: 'test2@test.fr',
    password: 'testtest'
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    Cypress.env('authToken', response.body.token);  // On stocke le token globalement
  });
});

/**
 * Commande de connexion via l'API.
 * Elle effectue une requête POST au point de terminaison de connexion
 * et retourne le jeton d'authentification.
 * @param {string} username - Le nom d'utilisateur (ou email).
 * @param {string} password - Le mot de passe.
 * @returns {string} Le jeton d'authentification.
 */
Cypress.Commands.add('connexion', (username, password) => {
  // 1. Définition de l'URL complète
  const loginUrl = `${Cypress.env('apiUrl')}/login`;

  // 2. Exécution de la requête API
  return cy.request({
    method: 'POST',
    url: loginUrl, // Utilisation de l'URL complète basée sur la variable d'environnement
    body: { 
      username, 
      password 
    },
  }).then((res) => {
    // 3. Vérifications de la réponse
    expect(res.status).to.eq(200);
    // Assurez-vous que l'API retourne bien un corps JSON avec une propriété 'token'
    expect(res.body).to.be.an('object').and.to.have.property('token');
    
    const token = res.body.token;

    // 4. RETOUR DU TOKEN
    // On retire l'étape de stockage du token dans Cypress.env() ici, 
    // car c'est le rôle de la commande suivante : cy.loginByToken(token).
    return token;
  });
});

/**
 * @file cypress/support/commands.js
 * @description Commandes Cypress personnalisées pour la gestion de l'authentification.
 */


// cypress/support/commands.js

// --- CORRECTION CRITIQUE ---
// Nous utilisons maintenant la clé exacte trouvée dans le localStorage : 'user'
const AUTH_KEY = 'user'; 

/**
 * Commande de connexion via un token.
 * Stocke le token dans le localStorage sous la clé 'user'.
 */
Cypress.Commands.add('loginByToken', (token) => {
  Cypress.env('authToken', token);
  cy.log(`Token stocké dans Cypress.env("authToken"). Clé de localStorage: ${AUTH_KEY}`);

  // 1. Assurer l'injection immédiate dans le localStorage avec la clé 'user'
  cy.window().then((win) => {
    win.localStorage.setItem(AUTH_KEY, token); // Utilisation de 'user'
    cy.log('Token injecté via cy.window() dans le localStorage');
  });

  // 2. Visiter la page d'accueil pour forcer l'initialisation de la session
  cy.visit('/');
});


/**
 * Visite une URL en réinjectant le token dans le localStorage via onBeforeLoad.
 */
Cypress.Commands.add('visitWithToken', (url) => {
  const token = Cypress.env('authToken');

  if (!token) {
    cy.log(`Aucun token trouvé. Visite simple de ${url}.`);
    return cy.visit(url);
  }

  cy.log(`Visite de ${url} avec réinjection de token dans onBeforeLoad. Clé: ${AUTH_KEY}`);
  cy.visit(url, {
    onBeforeLoad(win) {
      // INJECTION DANS LE LOCALSTORAGE SEULEMENT avec la clé 'user'
      win.localStorage.setItem(AUTH_KEY, token);
    }
  });
});

Cypress.Commands.add('obtenirProduitAleatoire', () => {
  const token = Cypress.env('authToken');

  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/products`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    failOnStatusCode: false, // pour éviter que le test plante direct
  }).then((res) => {
    if (res.status === 401) {
      // si pas connecté, récupérer les produits sans token
      return cy.request('GET', `${Cypress.env('apiUrl')}/products`).then((res2) => {
        const produits = res2.body.filter(p => p.availableStock > 0);
        const produitAleatoire = produits[Math.floor(Math.random() * produits.length)];
        return produitAleatoire;
      });
    }

    const produits = res.body.filter(p => p.availableStock > 0);
    const produitAleatoire = produits[Math.floor(Math.random() * produits.length)];
    return produitAleatoire;
  });
});

// --- Sélecteur personnalisé ---
Cypress.Commands.add('getBySel', (selector) => {
  return cy.get(`[data-cy=${selector}]`);
});

// 🔹 Récupérer un élément par data-cy
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

// Après chaque test, nettoie le localStorage et les cookies pour garantir
// que chaque test démarre dans un état propre, sans session persistante.
afterEach(() => {
  cy.clearAllLocalStorage();
  cy.clearAllCookies();
  // Si votre application utilise l'IndexedDB pour la session, ajoutez :
  // cy.clearAllIndexedDB();
});
