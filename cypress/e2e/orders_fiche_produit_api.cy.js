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

  it('Doit retourner la fiche produit avec id=3', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/products/3',
      headers: {
        Authorization: `Bearer ${Cypress.env('authToken')}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Vérification des champs exacts de la réponse
      expect(response.body).to.deep.equal({
        id: 3,
        name: "Sentiments printaniers",
        availableStock: -8,
        skin: "Propre, fraîche",
        aromas: "Frais et fruité",
        ingredients: "Framboise, zeste de citron et feuille de menthe",
        description: "Savon avec une formule douce à base d’huile de framboise, de citron et de menthe qui nettoie les mains efficacement sans les dessécher.",
        price: 60,
        picture: "https://cdn.pixabay.com/photo/2020/02/08/10/35/soap-4829708_960_720.jpg",
        varieties: 4
      });
    });
  });
});