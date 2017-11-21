/* eslint-env mocha */
/* global cy */
import {
  resetDatabase,
  visit,
  newId,
  enterTodo,
  getTodoItems,
  stubNewId
} from './utils'

describe('UI', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)
  beforeEach(stubNewId)

  it('loads application', () => {
    cy.get('.todoapp').should('be.visible')
  })

  it('adds two items', () => {
    enterTodo('first item')
    enterTodo('second item')
    getTodoItems().should('have.length', 2)
  })

  it('adds and deletes an item', () => {
    const id = newId()
    const title = `new item ${id}`

    const getNewItem = () =>
      cy
        .get('.todo-list')
        .find('li')
        .contains(id)

    enterTodo(title)

    getNewItem()
      .should('be.visible')
      .parent()
      .find('.destroy')
      .click({ force: true }) // because it only becomes visible on hover

    cy.contains(title).should('not.exist')
  })
})
