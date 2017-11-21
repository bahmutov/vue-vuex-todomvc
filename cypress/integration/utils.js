/* global cy */
export const resetDatabase = () => cy.exec('npm run reset:database')

export const visit = () => cy.visit('/')

export const newId = () =>
  Math.random()
    .toString(16)
    .substr(2, 10)
