describe('Ajouter un avis via API', () => {

  let token;

    beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken'); // ✅ token est bien défini ici
    });
  });

  it('Doit ajouter un avis', () => {
    const newReview = {
      title: "Avis sur le produit",
      comment: "Super produit !",
      rating: 3
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: newReview,
      failOnStatusCode: false
    }).then((res) => {
      // Vérifie le code HTTP
      expect(res.status).to.be.oneOf([200, 201]);

      // Vérifie que la réponse contient les champs principaux
      expect(res.body).to.have.property('title', newReview.title);
      expect(res.body).to.have.property('comment', newReview.comment);
      expect(res.body).to.have.property('rating', newReview.rating);

      // Vérifie que l'ID est présent
      expect(res.body).to.have.property('id');
    });
  });
});