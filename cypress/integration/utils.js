/* global cy */
export const resetDatabase = () => cy.exec('npm run reset:database')

export const visit = () => cy.visit('/')
