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

// --- Commande de connexion ---
Cypress.Commands.add('connexion', (username, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: { username, password },
  }).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body).to.have.property('token');
    const token = res.body.token;
    Cypress.env('authToken', token);
    return token;
  });
});

// --- Conserver le token dans le navigateur ---
Cypress.Commands.add('definirTokenEtConserver', (token) => {
  cy.window().then((win) => {
    win.localStorage.setItem('token', token);
    win.document.cookie = `token=${token}`;
  });
  cy.reload();
});

// --- Visiter une page avec le token déjà injecté ---
Cypress.Commands.add('visitAvecToken', (url) => {
  const token = Cypress.env('authToken');
  expect(token).to.exist;

  cy.visit(url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', token);
      win.document.cookie = `token=${token}`;
    },
  });

  cy.getBySel('nav-user', { timeout: 15000 })
    .should('contain.text', 'test2@test.fr');
});

// --- Définir le token dans le navigateur et recharger pour initialiser la session
Cypress.Commands.add('definirTokenEtRecharger', (token) => {
 cy.window().then((win) => {
 win.localStorage.setItem('token', token);
 win.document.cookie = `token=${token}`;
 });

 // On recharge la page d'accueil, pas simplement cy.reload()
 // Cela permet à ton appli de relire le token dès le démarrage.
 cy.visit('/#/', {
 onBeforeLoad(win) {
 win.localStorage.setItem('token', token);
 win.document.cookie = `token=${token}`;
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

