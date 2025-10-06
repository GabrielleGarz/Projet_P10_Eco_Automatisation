describe('API - Ajout d’un produit au panier', () => {
  let token;

  beforeEach(() => {
    // 🔐 Connexion pour récupérer le token
    cy.request('POST', `${Cypress.env('apiUrl')}/login`, {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      token = response.body.token;
    });
  });

  it('doit ajouter un produit au panier avec succès', () => {
    const productToAdd = {
      product: 3,
      quantity: 2
    };

    cy.request({
      method: 'PUT', // ✅ Vérifie bien que ton API accepte POST
      url: `${Cypress.env('apiUrl')}/orders/add`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: productToAdd,
      failOnStatusCode: false
    }).then((res) => {
      // 🧾 Log pour visualiser la réponse complète dans le terminal
      cy.log(JSON.stringify(res.body, null, 2));

      // ✅ Vérifie que la requête a réussi
      expect(res.status).to.be.oneOf([200, 201]);

      // ✅ Vérifie les champs principaux de la commande
      expect(res.body).to.include.all.keys(
        'id',
        'firstname',
        'lastname',
        'address',
        'zipCode',
        'city',
        'date',
        'validated',
        'orderLines'
      );

      // ✅ Vérifie que la commande n’est pas encore validée
      expect(res.body.validated).to.be.false;

      // ✅ Vérifie que les lignes de commande existent et contiennent au moins un produit
      expect(res.body.orderLines).to.be.an('array');
      expect(res.body.orderLines.length).to.be.greaterThan(0);

      // 🔍 Trouve la ligne correspondant au produit ajouté
      const orderLine = res.body.orderLines.find(
        (line) => line.product.id === productToAdd.product
      );

      expect(orderLine).to.exist;
      expect(orderLine).to.have.all.keys('id', 'product', 'quantity');

      // ✅ Vérifie que la quantité du produit ajouté est au moins celle demandée
      expect(orderLine.quantity).to.be.at.least(productToAdd.quantity);

      // ✅ Vérifie la structure du produit
      expect(orderLine.product).to.have.all.keys(
        'id',
        'name',
        'description',
        'price',
        'picture'
      );
    });
  });
});

