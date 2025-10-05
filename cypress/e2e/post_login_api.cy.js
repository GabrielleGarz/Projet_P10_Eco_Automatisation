// --- Tests Login ---
describe('Login API', () => {
  
  it('Doit échouer avec un utilisateur inconnu (401)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      failOnStatusCode: false, // pour capturer le 401 sans faire échouer Cypress
      body: {
        username: 'unknown@test.fr',
        password: 'wrongpassword'
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('Doit réussir avec un utilisateur connu (200)', () => {
    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      Cypress.env('authToken', response.body.token);
    });
  });

});
/*POST :

●	Login
○	http://localhost:8081/login
■	Utilisateur inconnu : retourne 401 en cas d’erreur
■	Utilisateur connu : retourne 200 s’il passe
*/