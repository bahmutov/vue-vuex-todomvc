/* eslint-env mocha */
/* global cy */
import {
  resetDatabase,
  visit,
  makeTodo,
  enterTodo,
  getTodoItems,
  stubNewId
} from './utils'

// testing TodoMVC server API
describe('API', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)
  beforeEach(stubNewId)

  it('receives empty list of items', () => {
    cy
      .request('todos')
      .its('body')
      .should('deep.equal', [])
  })

  it('adds two items', () => {
    const first = makeTodo()
    const second = makeTodo()

    cy.request('POST', 'todos', first)
    cy.request('POST', 'todos', second)
    cy
      .request('todos')
      .its('body')
      .should('have.length', 2)
      .and('deep.equal', [first, second])
  })

  it('adds two items and deletes one', () => {
    const first = makeTodo()
    const second = makeTodo()
    cy.request('POST', 'todos', first)
    cy.request('POST', 'todos', second)
    cy.request('DELETE', `todos/${first.id}`)
    cy
      .request('todos')
      .its('body')
      .should('have.length', 1)
      .and('deep.equal', [second])
  })

  it('does not delete non-existent item', () => {
    cy
      .request({
        method: 'DELETE',
        url: 'todos/aaa111bbb',
        failOnStatusCode: false
      })
      .its('status')
      .should('equal', 404)
  })

  it('observes API call from the store to the backend when adding todo item', () => {
    cy.server()
    cy
      .route({
        method: 'POST',
        url: '/todos'
      })
      .as('postTodo')

    enterTodo('first item')

    cy
      .wait('@postTodo')
      .its('request.body')
      .should('deep.equal', {
        title: 'first item',
        completed: false,
        id: '1'
      })
  })

  it('observes API call from the store to the backend when deleting a todo item', () => {
    cy.server()
    cy
      .route({
        method: 'DELETE',
        url: '/todos/1'
      })
      .as('deleteTodo')

    enterTodo('first item')
    getTodoItems()
      .first()
      .find('.destroy')
      .click({ force: true })

    cy.wait('@deleteTodo')
  })
})
