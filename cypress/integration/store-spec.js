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

  const toJSON = x => JSON.parse(JSON.stringify(x))

  // returns the entire Vuex store
  const getStore = () => cy.then(_ => cy.wrap(toJSON(store.state)))

  // returns given getter value from the store
  const getFromStore = property =>
    cy.then(_ => cy.wrap(store.getters[property]))

  // and a helper methods because we are going to pull "todos" often
  const getStoreTodos = getFromStore.bind(null, 'todos')

  it('starts empty', () => {
    getStoreTodos().should('deep.equal', [])
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

  it('can compare the entire store', () => {
    getStore().should('deep.equal', {
      loading: true, // initially the store is loading data
      todos: [],
      newTodo: ''
    })
  })

  it('can add a todo, type and compare entire store', () => {
    const title = 'a random todo'
    enterTodo(title)

    const text = 'learn how to test with Cypress.io'
    cy
      .get('.todoapp')
      .find('.new-todo')
      .type(text)
      .trigger('change')

    getStore().should('deep.equal', {
      loading: false,
      todos: [
        {
          title,
          completed: false,
          id: '1'
        }
      ],
      newTodo: text
    })
  })

  it('can add a todo', () => {
    const title = `a single todo ${newId()}`
    enterTodo(title)
    getStoreTodos()
      .should('have.length', 1)
      .its('0')
      .and('have.all.keys', 'id', 'title', 'completed')
  })

  // thanks to predictable random id generation
  // we know the objects in the todos list
  it('can add a particular todo', () => {
    const title = `a single todo ${newId()}`
    enterTodo(title)
    getStoreTodos().should('deep.equal', [
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

    getStoreTodos().should('deep.equal', [
      {
        title: second.title,
        completed: false,
        id: '4'
      }
    ])
  })

  it('can be driven by dispatching actions', () => {
    store.dispatch('setNewTodo', 'a new todo')
    store.dispatch('addTodo')
    store.dispatch('clearNewTodo')

    // assert UI
    getTodoItems()
      .should('have.length', 1)
      .first()
      .contains('a new todo')

    // assert store
    getStore().should('deep.equal', {
      loading: false,
      todos: [
        {
          title: 'a new todo',
          completed: false,
          id: '1'
        }
      ],
      newTodo: ''
    })
  })
})
