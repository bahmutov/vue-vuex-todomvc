/// <reference types="cypress" />
beforeEach(() => {
  cy.visit('/')
})

// selectors match Angular ones at http://todomvc.com/examples/angularjs/
// run Cypress with command
//    npx cypress open --config baseUrl=http://todomvc.com/examples/angularjs
it('stores todos', () => {
  cy.get('#new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')
  cy.get('#todo-list li') // command
    .should('have.length.gte', 2) // assertion
  cy.reload()
  cy.contains('#todo-list li', 'learn testing').should('be.visible')
  cy.contains('#todo-list li', 'be cool').should('be.visible')
})
