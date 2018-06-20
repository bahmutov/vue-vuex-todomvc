/// <reference types="cypress" />
it.only('opens the page', () => {
  cy.visit('http://localhost:3000')
})

it('has input element', () => {
  cy.visit('http://localhost:3000')
  cy.get('.new-todo') // command
    .should('be.visible') // assertion
})

it('adds 2 todos', () => {
  cy.visit('http://localhost:3000')
  cy.get('.new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')
  cy.get('.todo-list li') // command
    .should('have.length', 2) // assertion
})

describe('todos', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/reset',
      { todos: [] })
    cy.visit('http://localhost:3000')
  })

  it('has 2 todos', () => {
    cy.get('.new-todo')
      .type('learn testing{enter}')
      .type('be cool{enter}')
    cy.get('.todo-list li')
      .should('have.length', 2)
  })

  it.skip('wait for text to appear', () => {
    cy.get('.new-todo')
      .type('learn testing{enter}')
      .type('be cool{enter}')
    cy.get('.todo-list li')
      .should('have.length', 2)
    cy.contains('foo', {timeout: 60000})
  })
})

it('mocks todos', () => {
  cy.server()
  cy.route('/todos', [{
    completed: true,
    id: '111',
    title: 'stub server'
  }])
  cy.visit('/')
  cy.get('.todo-list li.completed')
    .should('have.length', 1)
})

it('mocks todos using fixture', () => {
  cy.server()
  cy.route('/todos', 'fx:todos')
  cy.visit('/')

  cy.log('checking completed items')
  cy.get('.todo-list li.completed')
    .should('have.length', 2)
  cy.log('checking remaining items')
  cy.get('.todo-list li:not(.completed)')
    .should('have.length', 2)
})

it('mocks todos using fixture with delay', () => {
  cy.server()
  cy.route({
    url: '/todos',
    response: 'fx:todos',
    delay: 3000
  })
  cy.visit('/')
  // initially has 0 items, because the "GET /todos" response is delayed
  cy.get('.todo-list li')
    .should('have.length', 0)

  // when "GET /todos" actually returns, DOM will show these items
  cy.log('checking completed items')
  cy.get('.todo-list li.completed')
    .should('have.length', 2)
  cy.log('checking remaining items')
  cy.get('.todo-list li:not(.completed)')
    .should('have.length', 2)
})
