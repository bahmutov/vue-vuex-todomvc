/* eslint-env mocha */
/* global cy */
describe('API', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('receives list of items', () => {
    cy.request('todos')
      .its('body')
      .then(list => {
        expect(list).to.be.an('array')
      })
  })
})
