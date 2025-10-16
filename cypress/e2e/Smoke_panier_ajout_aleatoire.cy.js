// cypress/e2e/produit_aleatoire_stable.cy.js

// --- Bloc 1 : Déconnexion (Vérification du formulaire de connexion) ---
describe('🚀 Formulaire de connexion - État déconnecté', () => {
  
  // Assure la déconnexion avant chaque test
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });
  
  it('Présence du formulaire de connexion', () => {
    cy.visit('/'); 
    cy.getBySel('nav-link-login').click();
    cy.getBySel('login-input-username').should('be.visible');
    cy.getBySel('login-input-password').should('be.visible');
    cy.getBySel('login-submit').should('be.visible');
  });
});



// --- Bloc 2 : Produit Déconnecté (Absence du panier) ---
describe('❌ Produit - Absence du bouton panier quand utilisateur est déconnecté', () => {

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });
    
  it('Présence du bouton d\'ajout au panier mais absence du bouton panier', () => {
    cy.obtenirProduitAleatoire().then((produit) => {
      cy.visit(`/#/products/${produit.id}`); 
      cy.getBySel('detail-product-add', { timeout: 15000 }).should('be.visible');
      // Le lien du panier ne doit pas exister
      cy.getBySel('nav-link-cart').should('not.exist');
    });
  });
});



// --- Bloc 3 : Utilisateur Connecté (Présence du panier) ---
describe('✅ Session active - Présence du bouton panier', () => {
  
  let produitId; 
  
  before(() => {
    // 1. Connexion et initialisation de la session
    cy.connexion('test2@test.fr', 'testtest').then((token) => {
      cy.loginByToken(token); 
    });
    
    // 2. Obtenir un produit à l'avance
    cy.obtenirProduitAleatoire().then((produit) => {
      produitId = produit.id;
    });
  });

  // Utiliser beforeEach pour naviguer vers la page produit (réutilise la session)
  beforeEach(() => {
    if (produitId) {
        cy.visitWithToken(`/#/products/${produitId}`);
    }
  });

  it('Affiche le bouton panier et masque le lien de connexion', () => {
    
    // NOUVELLE VÉRIFICATION DE LA CONNEXION : Le lien 'Connexion' ne doit plus exister.
    cy.getBySel('nav-link-login').should('not.exist');
      
    // Vérifications sur la page produit
    cy.getBySel('nav-link-cart', { timeout: 15000 }).should('exist').and('be.visible');
    cy.getBySel('detail-product-add', { timeout: 15000 }).should('be.visible');
  });
});



// --- Bloc 4 : Disponibilité du Produit ---
describe('📦 Vérifie la présence du champ de disponibilité du produit', () => {
  
  // Le test déconnecté est bien isolé dans un `it` avec nettoyage
  it('Affiche la disponibilité pour un produit aléatoire hors connexion', () => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();

    cy.obtenirProduitAleatoire().then((produit) => {
      cy.visit(`/#/products/${produit.id}`);
      cy.getBySel('detail-product-stock', { timeout: 15000 }).should('be.visible');
    });
  });
  
  // Le test connecté est isolé dans son `it`
  it('Affiche la disponibilité pour un produit aléatoire lorsque l\'utilisateur est connecté', () => {
    
    // Connexion dans le test pour isoler la session
    cy.connexion('test2@test.fr', 'testtest').then((token) => {
        cy.loginByToken(token); 
    });

    cy.obtenirProduitAleatoire().then((produit) => {
      cy.visitWithToken(`/#/products/${produit.id}`); 

      // NOUVELLE VÉRIFICATION DE LA CONNEXION : Le lien 'Connexion' ne doit plus exister.
      cy.getBySel('nav-link-login').should('not.exist');

      // Vérification de l'élément de stock
      cy.getBySel('detail-product-stock', { timeout: 15000 }).should('be.visible');
    });
  });
});




















