describe('Gestion du panier depuis l’interface produits', () => {
  let token;

  beforeEach(() => {
    // Connexion avec la commande custom
    cy.login().then(() => {
      token = Cypress.env('authToken');
    });
  });

  it('Produit ajouté au panier et stock déduit', () => {
    cy.request('GET', 'http://localhost:8081/products').then((res) => {
      expect(res.status).to.eq(200);
      const produitsEnStock = res.body.filter(p => p.availableStock > 1);
      const produitChoisi = produitsEnStock[0];

      // Visite de la page produit
      cy.visit(`http://localhost:4200/#/products/${produitChoisi.id}`);

      // Vérification du nom et du stock
      cy.contains(produitChoisi.name);
      cy.contains(`${produitChoisi.availableStock} en stock`);

      // Ajouter au panier
      cy.contains('Ajouter').click();

      // Aller directement sur la page panier
      //cy.visit('http://localhost:4200/#/cart');
      //cy.url().should('include', '/#/cart');
       cy.get('[data-cy=nav-link-cart]').click();

      // Vérifier que le produit est bien dans le panier
      cy.contains(produitChoisi.name);
      cy.contains('1'); // Quantité 
      
// ✅ Affichage du produit dans la console Cypress et console navigateur
cy.log(`Produit ajouté au panier : ${produitChoisi.name}`);
console.log('Produit ajouté au panier :', produitChoisi);

      // Retour sur la page produit pour vérifier le stock mis à jour
      cy.visit(`http://localhost:4200/#/products/${produitChoisi.id}`);
      cy.contains(`Stock: ${produitChoisi.availableStock - 1}`);
    });
  });

  it('Empêche une quantité négative', () => {
    cy.request('GET', 'http://localhost:8081/products').then((res) => {
      const produitChoisi = res.body.find(p => p.availableStock > 1);

      cy.visit(`http://localhost:4200/#/products/${produitChoisi.id}`);
      cy.get('input[type="number"]').clear().type('-1');
      cy.get('input[type="number"]').should('have.value', '1');
    });
  });

  it('Empêche une quantité supérieure à 20', () => {
    cy.request('GET', 'http://localhost:8081/products').then((res) => {
      const produitChoisi = res.body.find(p => p.availableStock > 20) || res.body[0];

      cy.visit(`http://localhost:4200/#/products/${produitChoisi.id}`);
      cy.get('input[type="number"]').clear().type('21');
      cy.get('input[type="number"]').should('have.value', '20');
    });
  });
});
