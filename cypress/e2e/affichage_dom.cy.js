cy.visit('http://localhost:4200/#/login');
cy.get('body').then($body => {
  // Affiche tout le HTML du body dans la console
  console.log($body.html());
});