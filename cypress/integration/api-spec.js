/* eslint-env mocha */
/* global cy */
import { resetDatabase, visit } from './utils'

describe('API', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)

  it('receives empty list of items', () => {
    cy
      .request('todos')
      .its('body')
      .should('deep.equal', [])
  })
})
