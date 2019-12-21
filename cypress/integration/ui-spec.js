/* eslint-env mocha */
/* global cy */
import {
  resetDatabase,
  visit,
  getTodoApp,
  enterTodo,
  getTodoItems,
  getTodoItem
} from './utils'

it('loads the app', () => {
  visit()
  getTodoApp().should('be.visible')
})

describe('UI', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)

  context('basic features', () => {
    it('loads application', () => {
      getTodoApp().should('be.visible')
    })

    it('starts with zero items', () => {
      cy
        .get('.todo-list')
        .find('li')
        .should('have.length', 0)
    })

    it('adds two items', () => {
      enterTodo('first item')
      enterTodo('second item')
      getTodoItems().should('have.length', 2)
    })

    it('completes and item', () => {
      enterTodo('first item')
      enterTodo('second item')
      getTodoItem(1).should('not.have.class', 'completed')
      getTodoItem(2).should('not.have.class', 'completed')
      getTodoItem(2).find('.toggle').check()
      getTodoItem(2).should('have.class', 'completed')
      // reload the data - 2nd item should still be completed
      cy.reload()
      getTodoItem(1).should('not.have.class', 'completed')
      getTodoItem(2).should('have.class', 'completed')
    })
  })

  context('advanced', () => {
    it('adds two and deletes first', () => {
      enterTodo('first item')
      enterTodo('second item')

      getTodoItems()
        .contains('first item')
        .parent()
        .find('.destroy')
        .click({ force: true }) // because it only becomes visible on hover

      cy.contains('first item').should('not.exist')
      cy.contains('second item').should('exist')
      getTodoItems().should('have.length', 1)
    })
  })
})
