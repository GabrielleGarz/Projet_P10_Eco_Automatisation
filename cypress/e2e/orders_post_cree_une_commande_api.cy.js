describe('API - Création ou validation d’une commande', () => {

  let token;

  beforeEach(() => {
    // ✅ On utilise la commande custom pour se connecter
    cy.login().then(() => {
      token = Cypress.env('authToken'); // ✅ token est bien défini ici
    });
  });

  it('doit créer ou valider une commande en cours', () => {
    // 🧾 Données de la commande à envoyer
    const orderData = {
      firstname: "test",
      lastname: "test",
      address: "42, rue Hardenberg",
      zipCode: "92220",
      city: "Bagneux"
    };

    // 🚀 Envoi de la requête POST à l’API
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/orders`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: orderData,
      failOnStatusCode: false
    }).then((res) => {
      // ✅ Vérifie que la requête a réussi
      expect(res.status).to.be.oneOf([200, 201]);

      // ✅ Vérifie les champs de la réponse principale
      expect(res.body).to.have.all.keys(
        'id', 'firstname', 'lastname', 'address', 'zipCode', 'city', 'date', 'validated', 'orderLines'
      );

      // ✅ Vérifie que les champs renvoyés correspondent aux données envoyées
      expect(res.body.firstname).to.eq(orderData.firstname);
      expect(res.body.lastname).to.eq(orderData.lastname);
      expect(res.body.address).to.eq(orderData.address);
      expect(res.body.zipCode).to.eq(orderData.zipCode);
      expect(res.body.city).to.eq(orderData.city);

      // ✅ Vérifie les types de données
      expect(res.body.id).to.be.a('number');
      expect(res.body.validated).to.be.a('boolean');
      expect(res.body.date).to.be.a('string');
      expect(res.body.orderLines).to.be.an('array');

      // ✅ Vérifie la structure d’un élément dans orderLines (si présent)
      if (res.body.orderLines.length > 0) {
        const orderLine = res.body.orderLines[0];
        expect(orderLine).to.have.keys('id', 'product', 'quantity');
        expect(orderLine.product).to.have.keys('id', 'name', 'description', 'price', 'picture');
      }
    });
  });
});
