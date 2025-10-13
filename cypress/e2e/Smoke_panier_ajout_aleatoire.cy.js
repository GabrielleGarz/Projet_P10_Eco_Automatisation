describe('Gestion du panier depuis l’interface produits', () => {
  beforeEach(() => {
    cy.loginEtConserverSession();
  });

  it('Doit afficher les boutons d’ajout au panier et le bouton panier pour un produit aléatoire', () => {
    cy.obtenirIdProduitAleatoire().then((idProduit) => {
      cy.visit(`http://localhost:4200/#/products/${idProduit}`);

      cy.get('[data-cy=detail-product-add]').should('be.visible');
      cy.get('[data-cy=nav-link-cart]', { timeout: 10000 })
        .should('exist')
        .and('be.visible');

      cy.log(`🧪 Produit testé : ID ${idProduit}`);
    });
  });
});


