/// <reference types="cypress" />
import {
  resetDatabase,
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
    cy.wait('@addTodo')
      .then(intercept => {
        const { request, response } = intercept
        expect(response, 'status code').to.have.property('statusCode', 201)
        expect(request.body, 'request body').to.deep.include({
          title: 'new todo',
          completed: false
        })
        expect(request.body, 'todo id').to.have.property('id').and.to.be.a('string')
          .and.to.match(/^\d+$/)
        expect(request.body, 'body same as response').to.deep.equal(response.body)
      })
  })
})
