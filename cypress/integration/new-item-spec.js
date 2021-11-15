/// <reference types="cypress" />
import {
  resetDatabase,
  visit,
} from './utils'

describe('Todo API', () => {
  beforeEach(resetDatabase)

  it('adds a todo', () => {
    cy.intercept('GET', '/todos').as('loadTodos')
    cy.visit('/')
    cy.wait('@loadTodos')

    // spy on the POST request that adds a new TODO item
    cy.intercept('POST', '/todos').as('addTodo')
    cy.get('.new-todo').type('new todo{enter}')
    cy.wait('@addTodo').its('request.body').should('deep.include', {
      title: 'new todo',
      completed: false
    })
  })
})
