describe('Ajouter un produit disponible au panier', () => {

  let token;

   beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken'); // ✅ token est bien défini ici
    });
  });

  it('Doit ajouter un produit avec stock positif au panier', () => {
    // Récupération de la liste des produits
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200);

      // Cherche un produit avec stock positif
      const availableProduct = res.body.find(p => p.availableStock > 0);
      expect(availableProduct, 'Il existe au moins un produit disponible').to.not.be.undefined;

      // Ajout du produit au panier via PUT
      cy.request({
        method: 'PUT',
        url: `${Cypress.env('apiUrl')}/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {
          product: availableProduct.id,
          quantity: 1
        }
      }).then((addRes) => {
        // Vérifie que la requête a réussi
        expect(addRes.status).to.eq(200);

        // Vérifie que la réponse contient au moins un champ existant, ici l'id de la commande
        expect(addRes.body).to.have.property('id');
        expect(addRes.body.id).to.be.a('number');

                // 📝 Affiche dans la console Cypress l'ID produit + quantité
        cy.log(`🛒 Produit ajouté au panier — ID produit: ${availableProduct.id}, Quantité: 1`);
      });
    });
  });

});