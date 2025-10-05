describe('Ajouter un avis via API', () => {

  let token;

  beforeEach(() => {
    // Connexion pour récupérer le token
    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr', // utilisateur connu
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
    });
  });

  it('Doit ajouter un avis', () => {
    const newReview = {
      title: "Avis sur le produit",
      comment: "Super produit !",
      rating: 5
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