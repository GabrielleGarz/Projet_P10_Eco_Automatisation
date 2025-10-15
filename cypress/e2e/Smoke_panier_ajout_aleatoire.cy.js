// 📄 cypress/e2e/produit_aleatoire_stable.cy.js
/// <reference types="cypress" />

describe('Formulaire de connexion', () => {
  it('Présence des champs et boutons dans le formulaire de connexion', () => {
    cy.visit('/');
    cy.getBySel('nav-link-login').click();
    cy.getBySel('login-input-username').should('be.visible');
    cy.getBySel('login-input-password').should('be.visible');
    cy.getBySel('login-submit').should('be.visible');
  });
});

describe('Absence du bouton panier quand utilisateur est déconnecté', () => {
  it('Affiche le bouton d\'ajout au panier mais pas le bouton panier', () => {
    cy.obtenirProduitAleatoire().then((produit) => {
      cy.visit(`/#/products/${produit.id}`);
      cy.getBySel('detail-product-add', { timeout: 15000 }).should('be.visible');
      cy.getBySel('nav-link-cart').should('not.exist');
    });
  });
});

describe('Tests avec utilisateur connecté', () => {
  let token;

  // --- Connexion unique et stockage du token ---
  before(() => {
    cy.connexion('test2@test.fr', 'testtest').then((t) => {
      token = t;
    });
  });

  it('Affiche le bouton panier et l’utilisateur connecté sur la page d’accueil', () => {
    cy.visitAvecToken('/#/', token); // initialise le store
    cy.getBySel('nav-link-cart', { timeout: 15000 }).should('be.visible');
    cy.getBySel('nav-user', { timeout: 15000 }).should('contain.text', 'test2@test.fr');
  });

  it('Affiche les boutons sur une page produit aléatoire', () => {
    cy.visitAvecToken('/#/', token); // initialise le store avant la navigation
    cy.getBySel('nav-user', { timeout: 15000 }).should('contain.text', 'test2@test.fr');

    cy.obtenirProduitAleatoire().then((produit) => {
      cy.get(`[data-cy=product-link-${produit.id}]`).click();
      cy.getBySel('detail-product-add', { timeout: 15000 }).should('be.visible');
      cy.getBySel('nav-link-cart', { timeout: 15000 }).should('exist').and('be.visible');
    });
  });

  it('Affiche la disponibilité sur une page produit aléatoire', () => {
    cy.visitAvecToken('/#/', token); // initialise le store
    cy.getBySel('nav-user', { timeout: 15000 }).should('contain.text', 'test2@test.fr');

    cy.obtenirProduitAleatoire().then((produit) => {
      cy.get(`[data-cy=product-link-${produit.id}]`).click();
      cy.getBySel('detail-product-stock', { timeout: 15000 }).should('be.visible');
    });
  });
});

describe('Disponibilité du produit hors connexion', () => {
  it('Affiche la disponibilité pour un produit aléatoire', () => {
    cy.obtenirProduitAleatoire().then((produit) => {
      cy.visit(`/#/products/${produit.id}`);
      cy.getBySel('detail-product-stock', { timeout: 15000 }).should('be.visible');
    });
  });
});
























