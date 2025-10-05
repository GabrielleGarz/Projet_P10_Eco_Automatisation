describe('API - Récupération des informations utilisateur connecté', () => {
  let token;

  beforeEach(() => {
    // Connexion pour récupérer le token
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      cy.log(`Token récupéré : ${token}`);
    });
  });

  it('Récupère les informations de l’utilisateur connecté', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/me`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      // Vérifie que la requête a réussi
      expect(response.status).to.eq(200);

      // Vérifie la présence des propriétés principales
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('email', 'test2@test.fr');
      expect(response.body).to.have.property('username', 'test2@test.fr');
      expect(response.body).to.have.property('firstname', 'test');
      expect(response.body).to.have.property('lastname', 'test');
      expect(response.body).to.have.property('roles').and.to.include('ROLE_USER');

      // Affiche les informations complètes dans le log Cypress
      cy.log('Informations utilisateur : ' + JSON.stringify(response.body));
    });
  });
});
