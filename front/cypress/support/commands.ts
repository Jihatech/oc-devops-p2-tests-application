/// <reference types="cypress" />

// Simule un utilisateur authentifié en injectant un JWT dans le localStorage.
Cypress.Commands.add('loginByToken', (token: string = 'fake-jwt') => {
  window.localStorage.setItem('auth_token', token);
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginByToken(token?: string): Chainable<void>;
    }
  }
}
export {};
