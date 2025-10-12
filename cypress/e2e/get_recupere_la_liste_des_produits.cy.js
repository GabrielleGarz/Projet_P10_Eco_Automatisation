describe('API - Récupération de la liste des produits', () => {
  let token;

  beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken');
    });
  });

  it('Récupère la liste des produits et vérifie leur structure', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      // ✅ Vérifie le statut HTTP
      expect(response.status).to.eq(200);

      // ✅ Vérifie que la réponse est bien un tableau
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);

       //  Log du nombre total de produits
      const totalProduits = response.body.length;
      cy.log(`📦 Nombre total de produits récupérés : ${totalProduits}`);

      // ✅ Vérifie les champs essentiels pour le premier produit
      const produit = response.body[0];
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

      // ✅ Vérifie que chaque produit contient une image valide
      response.body.forEach((p) => {
        expect(p).to.have.property('picture');
        expect(p.picture).to.match(/^https:\/\/cdn\.pixabay\.com/);
      });

      // ✅ Vérifie un produit précis (exemple : "Poussière de lune")
      const produitLune = response.body.find(p => p.name === 'Poussière de lune');
      expect(produitLune).to.exist;
      expect(produitLune).to.include({
        name: 'Poussière de lune',
        id: 5,
        price: 9.99,
        picture: 'https://cdn.pixabay.com/photo/2016/07/11/15/45/soap-1509963_960_720.jpg'
      });
    });
  });
});
