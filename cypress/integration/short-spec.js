/// <reference types="cypress" />
it.only('opens the page', () => {
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
  cy.route('http://localhost:3000/todos', [{
    completed: true,
    id: '111',
    title: 'stub server'
  }])
  cy.visit('http://localhost:3000')
  cy.get('.todo-list li.completed')
    .should('have.length', 1)
})

it('mocks todos using fixture', () => {
  cy.server()
  cy.route('http://localhost:3000/todos', 'fx:todos')
  cy.visit('http://localhost:3000')
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
    url: 'http://localhost:3000/todos',
    response: 'fx:todos',
    delay: 1000
  })
  cy.visit('http://localhost:3000')
  cy.log('checking completed items')
  cy.get('.todo-list li.completed')
    .should('have.length', 2)
  cy.log('checking remaining items')
  cy.get('.todo-list li:not(.completed)')
    .should('have.length', 2)
})
