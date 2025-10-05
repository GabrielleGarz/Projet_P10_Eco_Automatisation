describe('API - Récupération de 3 produits aléatoires', () => {
  let token;

  beforeEach(() => {
    // 🔐 Connexion pour obtenir le token avant chaque test
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      token = response.body.token;
    });
  });

  it('Récupère 3 produits aléatoires et vérifie leur structure', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products/random`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      // ✅ Vérifie que la requête s’est bien passée
      expect(response.status).to.eq(200);

      // ✅ Vérifie que la réponse est bien un tableau de 3 éléments
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.eq(3);

      // ✅ Vérifie que chaque produit contient les propriétés attendues
      response.body.forEach((produit) => {
        expect(produit).to.have.all.keys(
          'id',
          'name',
          'availableStock',
          'skin',
          'aromas',
          'ingredients',
          'description',
          'price',
          'picture',
          'varieties'
        );

        // Vérifie que l’image du produit est valide (hébergée sur Pixabay)
        expect(produit.picture).to.match(/^https:\/\/cdn\.pixabay\.com/);

        // Vérifie que le prix est bien un nombre positif
        expect(produit.price).to.be.a('number');
        expect(produit.price).to.be.greaterThan(0);
      });
    });
  });
});