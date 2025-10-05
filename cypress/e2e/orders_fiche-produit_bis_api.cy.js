// --- Tests avec authentification ---
describe('Avec authentification', () => {

  beforeEach(() => {
    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      Cypress.env('authToken', response.body.token);
    });
  });

  it('Doit retourner la fiche produit avec id=3 (vérification souple)', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/products/3',
      headers: {
        Authorization: `Bearer ${Cypress.env('authToken')}`
      }
    }).then((response) => {
       expect(response.status).to.eq(200);

      // Vérifie seulement les champs principaux
      expect(response.body).to.include({
        id: 3,
        name: "Sentiments printaniers",
        price: 60
      });

      // Vérifie que les autres champs existent sans tester le contenu exact
      expect(response.body).to.have.all.keys(
        "id",
        "name",
        "availableStock",
        "skin",
        "aromas",
        "ingredients",
        "description",
        "price",
        "picture",
        "varieties"
      );
    });
  });
});