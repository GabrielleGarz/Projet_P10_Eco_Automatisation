describe('API - Inscription utilisateur', () => {
  let token;

  const newUser = {
    email: "testgabrielle@test.fr",
    firstname: "Gabrielle",
    lastname: "Garz",
    plainPassword: "testtest"
  };

  beforeEach(() => {
    // Connexion pour récupérer le token
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
    });
  });

  it('Inscrit un nouvel utilisateur avec mot de passe correct ou gère l’erreur', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/register`,
      body: newUser,
      failOnStatusCode: false, // Pour gérer les statuts non 2xx
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      // L’API peut renvoyer 200 (création), 201 (création), ou 400 (erreur)
      expect([200, 201, 400]).to.include(response.status);

      if (response.status === 400) {
        // Vérifie l'erreur mot de passe non correspondant
        expect(response.body).to.have.property('plainPassword');
        expect(response.body.plainPassword.first[0])
          .to.eq("Les mots de passe doivent correspondre");
      } else {
        // Succès : vérifie que l’utilisateur est bien retourné
        expect(response.body).to.have.property('email', newUser.email);
        expect(response.body).to.have.property('firstname', newUser.firstname);
        expect(response.body).to.have.property('lastname', newUser.lastname);
      }
    });
  });
});
