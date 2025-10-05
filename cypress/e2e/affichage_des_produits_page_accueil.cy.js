describe('Affichage des produits sur la page d’accueil', () => {
  before(() => {
    cy.visit('http://localhost:4200/#/login');

    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('testtest');
    cy.get('[data-cy=login-submit]').click();

    cy.visit('http://localhost:4200/#/');
    cy.get('.list-products', { timeout: 20000 }).should('be.visible');
  });

  it('Vérifie le chargement et l’affichage des produits', () => {
    cy.get('.mini-product', { timeout: 20000 }).should('have.length.greaterThan', 0);

    cy.get('.mini-product').each((_, index) => {
      cy.get('.mini-product').eq(index).within(() => {
        cy.get('img').should('be.visible');
        cy.get('p, div').first().should('not.be.empty');
        cy.get('button, a').should('exist').and('be.visible');
      });
    });
  });

  it('Vérifie prix, stock et image via l’API', () => {
    cy.request('http://localhost:8081/products').then((response) => {
      expect(response.status).to.eq(200);
      const produits = response.body;

      produits.forEach((produit) => {
        expect(produit).to.have.property('price');
        expect(produit.price).to.be.a('number').and.to.be.greaterThan(0);

        expect(produit).to.have.property('availableStock');
        expect(produit.availableStock).to.be.a('number'); // tolérant (accepte négatif)

         expect(produit).to.have.property('picture'); // vérifie l'image dans l'API

        cy.log(`Produit ${produit.id} → stock ${produit.availableStock}, prix ${produit.price}, picture ${produit.picture}`);
      });

      cy.log(`Nombre de produits vérifiés via API : ${produits.length}`);
    });
  });
});