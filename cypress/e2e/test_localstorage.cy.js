// 📄 cypress/e2e/test_local_storage.cy.js

let token; // 👈 Variable globale pour réutiliser le token dans tous les tests

describe('Vérification de la connexion et du stockage du token', () => {

  before(() => {
    // 🔐 Connexion à l’API pour récupérer un token
    cy.connexion('test2@test.fr', 'testtest').then((t) => {
      token = t; // ✅ On garde le token pour les tests suivants
      cy.log('✅ Token récupéré : ' + token);

      // 📥 Stocker le token dans le localStorage
      cy.definirTokenEtConserver(token);

      // 🔎 Vérifier que le token est bien enregistré dans le navigateur
      cy.window().then((win) => {
        const storedToken = win.localStorage.getItem('token');
        cy.log('📦 Token stocké : ' + storedToken);
        expect(storedToken).to.exist;
        expect(storedToken).to.eq(token);
      });
    });
  });

  it('Vérifie que le token est toujours présent après rechargement de la page', () => {
    // 🧭 Visiter la page d’accueil
    cy.visit('/');

    // 📦 Vérifier à nouveau après chargement
    cy.window().then((win) => {
      const storedToken = win.localStorage.getItem('token');
      cy.log('🔐 Token après visite : ' + storedToken);
      expect(storedToken).to.exist;
      expect(storedToken).to.eq(token);
    });
  });

  it('Vérifie que le token fonctionne côté API (GET /me)', () => {
    // 📡 Requête directe vers l’API pour vérifier que le token est valide
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/me`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      cy.log('📡 Réponse API : ', JSON.stringify(res.body));
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('username', 'test2@test.fr');
    });
  });

});

