/// <reference types="cypress" />
import {
  resetDatabase,
} from './utils'

import todos from '../fixtures/example.json'
import spok from 'cy-spok'

describe('Todo API', () => {
  beforeEach(resetDatabase)

  beforeEach(() => {
    // iterate over the list of todos loaded from example.json
    // create a new todo item on the server
    // by making a cy.request to "POST /todos"
    // https://on.cypress.io/request
    todos.forEach(todo => {
      cy.request('POST', '/todos', todo)
    })
    // confirm the backend has the expected number of todos
    // by requesting it yourself from "GET /todos"
    // The number of todos should equal to the number of todos
    // imported from the example.json file
    cy.request('GET', '/todos').its('body').should('have.length', todos.length)
  })

  it('checks todos', () => {
    cy.visit('/')
      // The command cy.visit yields the "window" object of the application
      // if you look at "app.js", the application sets "window.app" object
      // from that object you can get the "todos" property which is Vuex store
      .its('app.todos')
      // the number of todos in the store should equal to the number
      // of todos in the example.json file
      .should('have.length', todos.length)
      // get the list of todos and iterate over each item
      // confirm that every todo object has fields that satisfy
      // following type predicates
      // - id is a string
      // - title is a string
      // - completed is a boolean
      // Tip: you can use "spok" predicates AND Cypress._ predicates
      // and even write your own small functions
      .then(list => {
      // pretend we do not have the exact list of todos
      // instead we want to check each item in the list
      list.forEach((todo, k) => {
        cy.log(`todo ${k + 1}`)
        cy.wrap(todo, {timeout: 0}).should(spok({
          id: spok.string,
          title: spok.string,
          completed: Cypress._.isBoolean
          // not implemented yet
          // completed: spok.boolean
        }))
      })
    })
  })
})
