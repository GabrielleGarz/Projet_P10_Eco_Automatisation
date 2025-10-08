describe('API - Récupération de 3 produits aléatoires', () => {
  let token;

  beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken');
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

      // 📝 ✅ Affichage en console des 3 produits aléatoires
      cy.log('📦 Produits aléatoires récupérés :');
      response.body.forEach((produit, index) => {
        cy.log(`Produit ${index + 1}:`);
        cy.log(`- ID: ${produit.id}`);
        cy.log(`- Nom: ${produit.name}`);
        cy.log(`- Prix: ${produit.price} €`);
        cy.log(`- Image: ${produit.picture}`);
      });

      // Pour un affichage détaillé dans la console développeur
      // (pratique en mode debug ou CI/CD)
      console.table(response.body.map(p => ({
        ID: p.id,
        Nom: p.name,
        Prix: p.price,
        Stock: p.availableStock,
        Image: p.picture
      })));
    });
  });
});
