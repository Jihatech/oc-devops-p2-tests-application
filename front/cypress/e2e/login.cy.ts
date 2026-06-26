describe('Authentification', () => {
  it('connecte l’utilisateur et redirige vers /etudiants', () => {
    cy.intercept('POST', '/api/login', 'fake-jwt').as('login');
    cy.intercept('GET', '/api/etudiants', []).as('list');

    cy.visit('/login');
    cy.get('[data-cy=login-input]').type('john');
    cy.get('[data-cy=password-input]').type('password');
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@login');
    cy.url().should('include', '/etudiants');
  });

  it('affiche une erreur si les identifiants sont invalides', () => {
    cy.intercept('POST', '/api/login', { statusCode: 400, body: 'Invalid credentials' }).as('login');

    cy.visit('/login');
    cy.get('[data-cy=login-input]').type('bad');
    cy.get('[data-cy=password-input]').type('bad');
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@login');
    cy.get('[data-cy=login-error]').should('be.visible');
  });

  it('protège la page étudiants (redirige vers /login sans token)', () => {
    cy.visit('/etudiants');
    cy.url().should('include', '/login');
  });
});
