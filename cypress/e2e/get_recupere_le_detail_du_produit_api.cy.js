describe('API - Récupération des détails du produit ID 3', () => {
  let token;

  beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken');
    });
  });

  it('Récupère les détails du produit ID 3 et les affiche dans le log', () => {
    const productId = 3;

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products/${productId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const produit = response.body;

      // ✅ Vérifications principales
      expect(produit).to.have.property('id', 3);
      expect(produit).to.have.property('name', 'Sentiments printaniers');
      expect(produit).to.have.property('availableStock', -22);
      expect(produit).to.have.property('skin', 'Propre, fraîche');
      expect(produit).to.have.property('aromas', 'Frais et fruité');
      expect(produit).to.have.property('ingredients', "Framboise, zeste de citron et feuille de menthe");
      expect(produit).to.have.property('price', 60);
      expect(produit).to.have.property('picture', 'https://cdn.pixabay.com/photo/2020/02/08/10/35/soap-4829708_960_720.jpg');
      expect(produit).to.have.property('varieties', 4);

      // ✅ Log clair dans l’interface Cypress
      cy.log('🧴 **Détails du produit ID 3** :');
      cy.log(`"id": ${produit.id}`);
      cy.log(`"name": "${produit.name}"`);
      cy.log(`"availableStock": ${produit.availableStock}`);
      cy.log(`"skin": "${produit.skin}"`);
      cy.log(`"aromas": "${produit.aromas}"`);
      cy.log(`"ingredients": "${produit.ingredients}"`);
      cy.log(`"description": "${produit.description}"`);
      cy.log(`"price": ${produit.price}`);
      cy.log(`"picture": "${produit.picture}"`);
      cy.log(`"varieties": ${produit.varieties}`);

      // ✅ (Optionnel) — afficher tout l’objet en JSON formaté dans la console développeur
      console.log('Détails complets du produit :', produit);
    });
  });
});