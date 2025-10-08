describe('API - Récupération des avis clients', () => {
  let token;

   beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken');
    });
  });

  it('Récupère et affiche la liste des avis postés sur le site', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/reviews`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);

      // ✅ Affiche les avis dans le log Cypress
      cy.log('📝 **Liste des avis récupérés :**');

      response.body.forEach((avis, index) => {
        cy.log(`--- Avis n°${index + 1} ---`);
        cy.log(`"id": ${avis.id}`);
        cy.log(`"date": "${avis.date}"`);
        cy.log(`"title": "${avis.title}"`);
        cy.log(`"comment": "${avis.comment}"`);
        cy.log(`"rating": ${avis.rating}`);
        cy.log(`"author": "${avis.author.firstname} ${avis.author.lastname}"`);
      });

      // ✅ Vérifie un exemple d’avis attendu
      const firstReview = response.body[0];
      expect(firstReview).to.have.property('id');
      expect(firstReview).to.have.property('title');
      expect(firstReview).to.have.property('comment');
      expect(firstReview).to.have.property('rating');
      expect(firstReview).to.have.property('author');
      expect(firstReview.author).to.have.property('email');

      // ✅ (Optionnel) — log complet dans la console développeur
      console.log('🧾 Détails complets des avis :', response.body);
    });
  });
});
