// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('sendGraphQLRequest', (query, options = {}) => {
    return cy.request({
        method: 'POST',
        url: 'https://graphqlzero.almansi.me/api',
        body: { query },
        ...options
    });
});