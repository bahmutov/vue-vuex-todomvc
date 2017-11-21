/* eslint-env mocha */
/* global cy */
import { resetDatabase, visit, newId, enterTodo } from './utils'

// testing the central Vuex data store
describe('Vuex store', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)

  let store

  beforeEach(() => {
    cy
      .window()
      .its('app')
      .its('$store')
      .then(s => {
        store = s
      })
  })

  it('starts empty', () => {
    cy.wrap(store.getters.todos).should('deep.equal', [])
  })

  it('can add a todo', () => {
    const title = `a single todo ${newId()}`
    enterTodo(title)
    cy
      .then(_ => cy.wrap(store.getters.todos))
      .should('have.length', 1)
      .its('0')
      .and('have.all.keys', 'id', 'title', 'completed')
  })
})
