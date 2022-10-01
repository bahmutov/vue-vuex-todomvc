/// <reference types="cypress" />
import {
  resetDatabase,
} from './utils'

// https://github.com/bahmutov/cy-spok
import spok from 'cy-spok'

describe('Todo API', () => {
  beforeEach(resetDatabase)

  it('adds a todo', () => {
    cy.intercept('GET', '/todos').as('loadTodos')
    cy.visit('/')
    cy.wait('@loadTodos')

    // spy on the POST request that adds a new TODO item
    cy.intercept('POST', '/todos').as('addTodo')
    cy.get('.new-todo').type('new todo{enter}')
    cy.wait('@addTodo').its('request.body')
      .should(spok({
        title: spok.startsWith('new'),
        completed: false,
        id: spok.string,
      }))
  })
})
