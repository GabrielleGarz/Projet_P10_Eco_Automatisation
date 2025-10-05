describe('Smoke test - page de connexion', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/#/login'); // Page de connexion
  });

  it('Vérifie la présence des champs et du bouton de connexion', () => {
    // Vérifie que le formulaire existe
    cy.get('[data-cy=login-form]').should('exist').and('be.visible');

    // Vérifie la présence du champ username/email
    cy.get('[data-cy=login-input-username]').should('exist').and('be.visible');

    // Vérifie la présence du champ password
    cy.get('[data-cy=login-input-password]').should('exist').and('be.visible');

    // Vérifie la présence du bouton de connexion
    cy.get('[data-cy=login-submit]').should('exist').and('be.visible');
  });
});