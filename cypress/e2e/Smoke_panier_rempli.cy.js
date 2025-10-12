describe('Smoke Test - Page Panier avec connexion', () => {
  before(() => {
    // Connexion
    cy.visit('http://localhost:4200/#/login');
    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('testtest');
    cy.get('[data-cy=login-submit]').click();
  });

  it('Ajoute un produit et vérifie que le panier l’affiche', () => {
    // Aller sur une page produit
    cy.visit('http://localhost:4200/#/products/5');

    // Cliquer sur “Ajouter au panier”
    cy.contains('Ajouter').click();

    // Aller sur la page panier
    cy.get('[data-cy=nav-link-cart]').click();

    // Vérifier que la ligne du produit ajouté est bien là
    cy.get('[data-cy=cart-line]').should('exist').and('be.visible');

    // Afficher dans la console le nombre de produits dans le panier
    cy.get('[data-cy=cart-line]').then(($lines) => {
      cy.log(`Nombre de lignes panier : ${$lines.length}`);
    });
  });
});
