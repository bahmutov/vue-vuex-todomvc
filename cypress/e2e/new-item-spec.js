/// <reference types="cypress" />
import {
  resetDatabase,
} from './utils'

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
    cy.wait('@addTodo')
      .should(spok({
        request: {
          body: {
            title: 'new todo',
            completed: false,
            id: spok.test(/^\d+$/)
          }
        },
        response: {
          statusCode: 201,
          body: {
            title: 'new todo',
            completed: false,
            id: spok.test(/^\d+$/)
          }
        }
      }))
  })
})
