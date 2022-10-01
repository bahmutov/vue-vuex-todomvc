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
    // stub the "Math.random" method to return known id
    cy.window().its('Math').then(Math => {
      cy.stub(Math, 'random').returns(0.12345)
    })
    cy.get('.new-todo').type('new todo{enter}')
    // we know know exactly the entire Todo object
    const body = {
      title: 'new todo',
      completed: false,
      id: '12345'
    }
    cy.wait('@addTodo')
      .should(spok({
        request: {
          body
        },
        response: {
          statusCode: 201,
          body
        }
      }))
  })
})
