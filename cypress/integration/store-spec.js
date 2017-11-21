/* eslint-env mocha */
/* global cy */
import {
  resetDatabase,
  visit,
  newId,
  enterTodo,
  stubNewId,
  makeTodo,
  getTodoItems
} from './utils'

// testing the central Vuex data store
describe('Vuex store', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)
  beforeEach(stubNewId)

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

  const getFromStore = property =>
    cy.then(_ => cy.wrap(store.getters[property]))

  it('starts empty', () => {
    cy.wrap(store.getters.todos).should('deep.equal', [])
  })

  it('can enter new todo text', () => {
    const text = 'learn how to test with Cypress.io'
    cy
      .get('.todoapp')
      .find('.new-todo')
      .type(text)
      .trigger('change')

    getFromStore('newTodo').should('equal', text)
  })

  it('can add a todo', () => {
    const title = `a single todo ${newId()}`
    enterTodo(title)
    getFromStore('todos')
      .should('have.length', 1)
      .its('0')
      .and('have.all.keys', 'id', 'title', 'completed')
  })

  // thanks to predictable random id generaton
  // we know the objects in the todos list
  it('can add a particular todo', () => {
    const title = `a single todo ${newId()}`
    enterTodo(title)
    getFromStore('todos').should('deep.equal', [
      {
        title,
        completed: false,
        id: '2'
      }
    ])
  })

  it('can add two todos and delete one', () => {
    const first = makeTodo()
    const second = makeTodo()

    enterTodo(first.title)
    enterTodo(second.title)

    getTodoItems()
      .should('have.length', 2)
      .first()
      .find('.destroy')
      .click({ force: true })

    getTodoItems().should('have.length', 1)

    getFromStore('todos').should('deep.equal', [
      {
        title: second.title,
        completed: false,
        id: '4'
      }
    ])
  })
})
