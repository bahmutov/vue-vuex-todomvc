/// <reference types="cypress" />
import { resetDatabase } from './utils'

it.only('opens the page', () => {
  resetDatabase()
  cy.visit('http://localhost:3000')
  cy.get('.new-todo').should('be.visible')
})

it('adds 2 todos', () => {
  resetDatabase()
  cy.visit('http://localhost:3000')
  cy.get('.new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')
  cy.get('.todo-list li')
    .should('have.length', 2)
})

describe('todos', () => {
  beforeEach(() => {
    resetDatabase()
    cy.visit('http://localhost:3000')
  })

  it('has 2 todos', () => {
    cy.get('.new-todo')
      .type('learn testing{enter}')
      .type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
  })

  it.skip('wait for text to appear', () => {
    cy.get('.new-todo')
      .type('learn testing{enter}')
      .type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
    cy.contains('foo', {timeout: 100000})
  })
})

it('mocks todos', () => {
  cy.server()
  cy.route('http://localhost:3000/todos', [{
    completed: true,
    id: '111',
    title: 'stub server'
  }])
  cy.visit('http://localhost:3000')
  cy.get('.todo-list li.completed')
    .should('have.length', 1)
})

it('mocks todos using fixture', () => {
  cy.server()
  cy.route('http://localhost:3000/todos', 'fx:todos')
  cy.visit('http://localhost:3000')
  cy.get('.todo-list li.completed')
    .should('have.length', 1)
})
