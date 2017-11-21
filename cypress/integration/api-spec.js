/* eslint-env mocha */
/* global cy */
import { resetDatabase, visit, newId } from './utils'

// testing TodoMVC server API
describe('API', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)

  const makeTodo = () => {
    const id = newId()
    const title = `todo ${id}`
    return {
      id,
      title,
      completed: false
    }
  }

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
})
