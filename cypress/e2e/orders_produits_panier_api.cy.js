describe('Vérification du panier', () => {

  // --- Tests avec authentification ---
  describe('Avec authentification', () => {

    beforeEach(() => {
      cy.request('POST', 'http://localhost:8081/login', {
        username: 'test2@test.fr',
        password: 'testtest'
      }).then((response) => {
        expect(response.status).to.eq(200);
        Cypress.env('authToken', response.body.token);
      });
    });

    it('Devrait retourner la liste des produits dans le panier avec les propriétés correctes', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders', // <-- endpoint sécurisé
        headers: {
          Authorization: `Bearer ${Cypress.env('authToken')}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property('id');
          expect(response.body[0]).to.have.property('name');
          expect(response.body[0]).to.have.property('price');
        }
      });
    });
  });

  // --- Tests sans authentification ---
  describe('Sans authentification', () => {
    it('Devrait renvoyer 401 ou 403 si non authentifié', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders', // <-- endpoint sécurisé
        failOnStatusCode: false
      }).then((response) => {
        expect([401, 403]).to.include(response.status);
      });
    });
  });

});

/*●	Requête de la liste des produits du panier
○	http://localhost:8081/orders
Doit retourner la liste des produits qui sont dans le panier ;

*/