describe('Vérification accès aux données confidentielles sans connexion', () => {
  it('Devrait renvoyer une erreur 401 ou 403 si non authentifié', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/orders`,
      failOnStatusCode: false // ne fait pas échouer le test automatiquement
    }).then((response) => {
      // Vérifie que le code de status est 401 ou 403
      expect([401, 403]).to.include(response.status);

      // Vérifie qu'il y a bien une réponse avec un message d'erreur
      expect(response.body).to.exist;
      // exemple : { error: "Unauthorized" }
      // if tu connais la structure exacte :
      // expect(response.body.error).to.eq("Unauthorized");
    });
  });
});

/*GET :

●	Requête sur les données conﬁdentielles d'un utilisateur avant connexion pour vériﬁer que je reçois une erreur :
○	http://localhost:8081/orders qui renvoie le panier de la personne connectée, sans être connectée.
Pour rappel, 401 c’est que vous n’êtes pas authentiﬁé et 403, c’est que vous n’avez pas les bons droits ;
*/
