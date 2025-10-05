describe('API - Modifier la quantité d’une commande', () => {
  let token;

  beforeEach(() => {
    // Connexion pour récupérer le token avant chaque test
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      token = response.body.token;
    });
  });

  it('Modifie la quantité de la ligne de commande 42 et vérifie la réponse', () => {
    const body = { quantity: 6 };

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/orders/42/change-quantity`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Vérifie que la commande globale est bien structurée
      const commande = response.body;
      expect(commande).to.have.property('id').and.to.be.a('number');
      expect(commande).to.have.property('orderLines').and.to.be.an('array');

      // Cherche la ligne correspondant à id: 42
      const ligneModifiee = commande.orderLines.find((line) => line.id === 42);
      expect(ligneModifiee).to.exist;

      // Vérifie la nouvelle quantité
      expect(ligneModifiee.quantity).to.eq(6);

      // Vérifie les infos du produit
      const produit = ligneModifiee.product;
      expect(produit).to.have.property('id', 5);
      expect(produit).to.have.property('name', 'Poussière de lune');
      expect(produit).to.have.property('price', 9.99);
      expect(produit).to.have.property(
        'picture',
        'https://cdn.pixabay.com/photo/2016/07/11/15/45/soap-1509963_960_720.jpg'
      );
    });
  });
});