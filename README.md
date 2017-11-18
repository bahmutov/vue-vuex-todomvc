# vue-vuex-todomvc

Simple TodoMVC with [Vue.js](https://vuejs.org/)
and [Vuex](https://vuex.vuejs.org/en/) data store.

Based on [this Vuex tutorial](https://codeburst.io/build-a-simple-todo-app-with-vue-js-1778ae175514) and the basic official [TodoMVC vue.js example](https://github.com/vuejs/vue/tree/dev/examples/todomvc)

Just open the [index.html](index.html) file in the browser.

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
