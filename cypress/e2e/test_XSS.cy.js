describe('Test XSS / évaluation de code via API (vérifier que "2+2" reste "2+2")', () => {

  let token;

  beforeEach(() => {
    // 🔐 Connexion pour récupérer le token JWT
    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
    });
  });

  it('doit conserver la chaîne "2+2" dans le champ comment et ne PAS renvoyer 4', () => {
    const newReview = {
      title: 'Test XSS - Évaluation',
      comment: '2+2', // ⚠️ doit rester une chaîne
      rating: 5
    };

    // 🚀 Envoi du commentaire "2+2"
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
      cy.log(JSON.stringify(res.body, null, 2));

      // ✅ Vérifie que la requête a réussi
      expect(res.status).to.be.oneOf([200, 201]);

      // ✅ Vérifie que le champ comment existe
      expect(res.body).to.have.property('comment');

      // ✅ Vérifie que le commentaire n’a PAS été évalué en 4
      expect(res.body.comment).to.eq('2+2');

      // ✅ Vérifie que la valeur n’a pas été exécutée ni modifiée
      expect(res.body.comment).not.to.eq(4);
      expect(res.body.comment).not.to.match(/<script.*?>.*?<\/script>/i);
    });
  });
});
