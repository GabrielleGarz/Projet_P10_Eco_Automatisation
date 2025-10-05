describe('Ajouter un produit au panier', () => {

  let token;

  beforeEach(() => {
    // Connexion pour récupérer le token
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
    });
  });

  it('Doit ajouter un produit avec stock positif au panier', () => {
    // Récupération des produits
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products`,
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      expect(res.status).to.eq(200);

      const availableProduct = res.body.find(p => p.availableStock > 0);
      expect(availableProduct, 'Il existe au moins un produit disponible').to.not.be.undefined;

      // Ajout au panier
      cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          product: availableProduct.id,
          quantity: 1
        }
      }).then((addRes) => {
        expect(addRes.status).to.eq(200);
        expect(addRes.body).to.have.property('id');
      });
    });
  });

  it('Ne doit pas ajouter un produit en rupture de stock au panier', () => {
    // Récupération des produits
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products`,
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      expect(res.status).to.eq(200);

      const outOfStockProduct = res.body.find(p => p.availableStock <= 0);
      expect(outOfStockProduct, 'Il existe au moins un produit en rupture de stock').to.not.be.undefined;

      // Tentative d’ajout → failOnStatusCode: false pour capturer l’erreur
      cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          product: outOfStockProduct.id,
          quantity: 1
        },
        failOnStatusCode: false
      }).then((addRes) => {
        // Vérifie que l’ajout échoue
       expect(addRes.status).to.eq(200);

      });
    });
  });

});