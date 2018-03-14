# vue-vuex-todomvc [![Build Status](https://travis-ci.org/bahmutov/vue-vuex-todomvc.svg?branch=master)](https://travis-ci.org/bahmutov/vue-vuex-todomvc)

Simple TodoMVC with [Vue.js](https://vuejs.org/)
and [Vuex](https://vuex.vuejs.org/en/) data store.

Based on [this Vuex tutorial](https://codeburst.io/build-a-simple-todo-app-with-vue-js-1778ae175514) and the basic official [TodoMVC vue.js example](https://github.com/vuejs/vue/tree/dev/examples/todomvc)

Read my [step by step tutorial](https://glebbahmutov.com/blog/vue-vuex-rest-todomvx/) explaining the code and this [thorough blogpost](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/) how this application is tested using Cypress.

## Software organization

![Vue Vuex REST data flow](vue-vuex-rest.png)

## Use

Clone this repository then

```
npm install
npm start
```

Open `localhost:3000` in the browser.

## Tests

All tests are implemented using [Cypress.io](https://www.cypress.io/)

- [GUI E2E tests](cypress/integration/ui-spec.js)
- [API tests](cypress/integration/api-spec.js)
- [Vuex store tests](cypress/integration/store-spec.js)

## Development

The `app` global variable exposes the Vue instance.

To see "plain" values from the store (without all `Observer` additions)

```js
app.$store.getters.todos
    .map(JSON.stringify) // strips utility fields
    .map(JSON.parse)     // back to plain objects
    .forEach(t => console.log(t)) // prints each object
```

Or print them as a table

```js
console.table(app.$store.getters.todos.map(JSON.stringify).map(JSON.parse))
```
