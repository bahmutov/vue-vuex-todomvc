/// <reference types="cypress" />
import { resetDatabase } from './utils'

import spok from 'cy-spok'
import todos from '../fixtures/example.json'

describe('Todo', () => {
  beforeEach(() => {
    resetDatabase(todos)
  })

  it('adds a todo', () => {
    cy.visit(
      '/?type=completed&n=4&start_id=201&_cache_bust=' + Cypress._.random(1e6),
    )
    cy.location('search')
      .should('include', 'type=completed&n=4&start_id=201&_cache_bust=')
      .then((s) => new URLSearchParams(s))
      .invoke('entries')
      .then(Array.from)
      .then(Cypress._.fromPairs)
      .then(console.log)
      .then((o) => {
        Cypress._.update(o, 'n', Number)
        Cypress._.update(o, 'start_id', Number)
      })
      .should('deep.include', {
        type: 'completed',
        n: todos.length,
        start_id: 201,
      })
      .should(
        spok({
          type: (s) => ['active', 'completed'].includes(s),
          n: todos.length,
          start_id: spok.number,
        }),
      )
      .and(
        spok({
          _cache_bust: spok.string,
        }),
      )
      .its('_cache_bust')
      .should('have.length.greaterThan', 5)
  })
})
