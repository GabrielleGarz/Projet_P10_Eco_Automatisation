describe('Smoke Test - Page Panier avec connexion', () => {
  before(() => {
    // Page login
    cy.visit('http://localhost:4200/#/login');

    // Remplit le formulaire avec les identifiants
    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('testtest');

    // Clique sur le bouton de connexion
    cy.get('[data-cy=login-submit]').click();

    // Accède à la page d'accueil
    cy.visit('http://localhost:4200/#/');
  });

  it('Vérifie la présence des boutons d’ajout au panier', () => {
    // Clique sur le bouton Panier dans la navigation
    cy.get('[data-cy=nav-link-cart]').click();

    // Vérifie que les boutons cart-line existent et sont visibles
    cy.get('[data-cy=cart-line]').should('exist').and('be.visible');

    // Logue le nombre de boutons trouvés
    cy.get('[data-cy=cart-line]').then(($buttons) => {
      const count = $buttons.length;
      cy.log(`Nombre de boutons "cart-line" trouvés : ${count}`);
      expect(count).to.be.greaterThan(0); // Assertion : au moins un bouton
    });

    // Vérifie individuellement chaque bouton et logue
    cy.get('[data-cy=cart-line]').each(($el, index) => {
      cy.wrap($el).should('exist').and('be.visible');
      cy.log(`Bouton ${index + 1} trouvé et visible`);
    });
  });
});