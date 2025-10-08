describe('Avec authentification', () => {
  let token; // ✅ Déclaration ici — accessible dans tout le describe

  beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken'); // ✅ token est bien défini ici
    });
  });

  it('Doit retourner la fiche produit avec id=3', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products/3`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const produit = response.body;

      // ✅ Vérifie que la fiche contient les champs attendus
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

      // ✅ Vérifie que l'ID correspond bien à 3
      expect(produit.id).to.eq(3);

      // ✅ Vérifie que l’image est bien une URL pixabay
      expect(produit.picture).to.match(/^https:\/\/cdn\.pixabay\.com/);

      // ✅ Affiche toutes les caractéristiques du produit
      cy.log('📦 **Fiche produit complète**');
      cy.log(`🆔 ID : ${produit.id}`);
      cy.log(`🪻 Nom : ${produit.name}`);
      cy.log(`📦 Stock disponible : ${produit.availableStock}`);
      cy.log(`🧼 Type de peau : ${produit.skin}`);
      cy.log(`🌸 Arômes : ${produit.aromas}`);
      cy.log(`🌿 Ingrédients : ${produit.ingredients}`);
      cy.log(`📝 Description : ${produit.description}`);
      cy.log(`💰 Prix : ${produit.price} €`);
      cy.log(`🖼️ Image : ${produit.picture}`);
      cy.log(`🌿 Variétés : ${JSON.stringify(produit.varieties)}`);

      // ✅ Affichage dans la console pour un debug plus complet
      console.log('🧾 Fiche produit complète', produit);
    });
  });
});

