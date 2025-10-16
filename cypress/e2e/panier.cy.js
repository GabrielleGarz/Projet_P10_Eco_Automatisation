// cypress/e2e/gestion_panier_produits.cy.js

describe('Gestion du panier depuis l’interface produits', () => {
  
  // Utilisez before pour établir la session une seule fois
  before(() => {
    // 1. Connexion pour obtenir le jeton (token)
    cy.connexion('test2@test.fr', 'testtest').then((token) => {
        // 2. Injection du jeton dans le localStorage et visite initiale
        cy.loginByToken(token); 
    });
  });

  // Assurez-vous que le panier est vide avant chaque test de ce bloc.
  beforeEach(() => {
    // Si votre application a un bouton de déconnexion, il serait bon de le mettre ici
    // ou d'utiliser une requête API pour vider le panier si possible.
    // Nous partons du principe que la session est persistante.
  });



  it('Produit ajouté au panier et stock déduit', () => {
    // Utiliser cy.request pour obtenir les données, cela ne dépend pas de l'état du navigateur
    cy.request('GET', 'http://localhost:8081/products').then((res) => {
      expect(res.status).to.eq(200);
      const produitsEnStock = res.body.filter(p => p.availableStock > 1);
      const produitChoisi = produitsEnStock[0];

      // Visite de la page produit en s'assurant que le token est injecté
      cy.visitWithToken(`/#/products/${produitChoisi.id}`);

      // Vérification du nom et du stock
      cy.contains(produitChoisi.name);
      cy.contains(`${produitChoisi.availableStock} en stock`);

      // Ajouter au panier
      cy.contains('Ajouter').click();

      // Aller directement sur la page panier (Le token est réinjecté grâce à visitWithToken)
      cy.get('[data-cy=nav-link-cart]').click();
      cy.url().should('include', '/#/cart');

      // Vérifier que le produit est bien dans le panier
      cy.contains(produitChoisi.name);
      cy.contains('1'); // Quantité 
      
      cy.log(`Produit ajouté au panier : ${produitChoisi.name}`);
      
      // Retour sur la page produit pour vérifier le stock mis à jour
      cy.visitWithToken(`/#/products/${produitChoisi.id}`); // Utilisation de visitWithToken
      cy.contains(`Stock: ${produitChoisi.availableStock - 1}`);
    });
  });



  it('Empêche une quantité négative', () => {
    cy.request('GET', 'http://localhost:8081/products').then((res) => {
      const produitChoisi = res.body.find(p => p.availableStock > 1);

      // Visite avec session active
      cy.visitWithToken(`/#/products/${produitChoisi.id}`); 
      cy.get('input[type="number"]').clear().type('-1');
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });



  it('Empêche une quantité supérieure à 20', () => {
    cy.request('GET', 'http://localhost:8081/products').then((res) => {
      const produitChoisi = res.body.find(p => p.availableStock > 20) || res.body[0];

      // Visite avec session active
      cy.visitWithToken(`/#/products/${produitChoisi.id}`);
      cy.get('input[type="number"]').clear().type('21');
      cy.get('input[type="number"]').should('have.value', '20');
    });
  });
});
