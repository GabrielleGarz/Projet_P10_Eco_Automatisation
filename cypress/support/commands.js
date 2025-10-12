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


// 🟡 --- Commande pour récupérer les produits ---
Cypress.Commands.add('getProduits', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:8081/products',
    headers: {
      Authorization: `Bearer ${Cypress.env('authToken')}`
    }
  }).then((response) => {
    expect(response.status).to.eq(200);

    // 📝 Log utile pour debug
    cy.log('Produits récupérés : ' + JSON.stringify(response.body));

    // ✅ on wrappe le body pour pouvoir le récupérer plus tard
    cy.wrap(response.body).as('produits');
  });
});


// 🟣 --- Commande pour sélectionner un produit avec du stock ---
Cypress.Commands.add('selectProduitEnStock', () => {
  cy.get('@produits').then((produits) => {
    const produitsEnStock = produits.filter(p => p.availableStock > 0);

    if (produitsEnStock.length === 0) {
      throw new Error('❌ Aucun produit avec du stock disponible');
    }

    const produitChoisi = produitsEnStock[0]; // 👉 prend le premier disponible
    cy.wrap(produitChoisi).as('produitChoisi');
  });
});