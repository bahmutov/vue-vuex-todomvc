/* global cy */
export const resetDatabase = () => {
  cy.exec('npm run reset:database')
  cy.wait(3000) // gives json-server a chance to reload
}

export const visit = () => cy.visit('/')

export const newId = () =>
  Math.random()
    .toString(16)
    .substr(2, 10)

export const makeTodo = (text = 'todo') => {
  const id = newId()
  const title = `${text} ${id}`
  return {
    id,
    title,
    completed: false
  }
}

export const enterTodo = (text = 'example todo') =>
  cy
    .get('.todoapp')
    .find('.new-todo')
    .type(`${text}{enter}`)
