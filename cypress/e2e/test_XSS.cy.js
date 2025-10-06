// cypress/e2e/test_xss_arithmetic.cy.js
describe('Test XSS / évaluation de code via API (vérifier que "2+2" reste "2+2")', () => {
  let token;

  // Connexion avant chaque test pour récupérer le token JWT
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
    });
  });

  it('doit conserver la chaîne "2+2" dans le champ comment et ne PAS renvoyer 4', () => {
    // -> IMPORTANT : on envoie une chaîne, pas une expression JS.
    const commentPayload = '2+2';

    const newReview = {
      title: "Test d'évaluation arithmétique via API",
      comment: commentPayload, // bien une string !
      rating: 5
    };

    // Envoi du review
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
      // Vérifie succès création/acceptation
      expect(res.status).to.be.oneOf([200, 201]);

      // Vérifie que le champ comment est présent dans la réponse
      expect(res.body).to.have.property('comment');

      const returned = String(res.body.comment);

      // Si l'API a évalué le contenu et renvoie "4", on échoue explicitement
      if (returned === '4') {
        throw new Error(
          'FAIL: Le serveur a renvoyé "4" pour le champ comment. ' +
          'Cela peut indiquer que le contenu a été évalué/exécuté côté serveur — possible faille.'
        );
      }

      // Attendu : la valeur renvoyée doit être exactement la chaîne "2+2"
      expect(returned).to.eq(commentPayload);

      // Optionnel : récupération via GET pour s'assurer que la valeur est persistée telle quelle
      // (utilise l'ID retourné si présent)
      if (res.body.id) {
        cy.request({
          method: 'GET',
          url: `http://localhost:8081/reviews/${res.body.id}`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false
        }).then((getRes) => {
          expect(getRes.status).to.be.oneOf([200, 201, 204]);
          if (getRes.body && getRes.body.comment) {
            const stored = String(getRes.body.comment);
            if (stored === '4') {
              throw new Error(
                'FAIL: Après récupération (GET), le champ comment vaut "4". ' +
                'Possible évaluation/exécution du contenu.'
              );
            }
            expect(stored).to.eq(commentPayload);
          } else {
            // Si le GET ne renvoie pas le body attendu, on loggue pour investigation
            cy.log('GET ne retourne pas de champ comment exploitable :', getRes.body);
          }
        });
      }
    });
  });
});
