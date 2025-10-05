describe('Connexion utilisateur', () => {
  it('Permet de se connecter et d’afficher le bouton Panier', () => {
    // Aller sur la page d'accueil
    cy.visit('http://localhost:4200/#/');

    // Cliquer sur le bouton Connexion
    cy.get('[data-cy=nav-link-login]').click(); // ou selector correspondant au bouton Connexion

    // Vérifier que le formulaire de connexion s'affiche
    cy.get('[data-cy=login-form]').should('be.visible');

    // Remplir le formulaire
    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('testtest');

    // Cliquer sur le bouton de connexion
    cy.get('[data-cy=login-submit]').click();

    // Vérifier que l'utilisateur est connecté : le bouton panier est visible
    cy.get('[data-cy=nav-link-cart]').should('be.visible');
  });
});