// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~150 lines.

Vue.use(Vuex)

const store = new Vuex.Store({
 state: {
   todos: [],
   newTodo: 'foo'
 },
 getters: {
  newTodo: state => {
    console.log('getters.newTodo')
    return state.newTodo
  }
 },
 mutations: {
   GET_TODO(state, todo){
     state.newTodo = todo
   },
   ADD_TODO(state){
      console.log('add todo', state.newTodo)
     state.todos.push({
       body: state.newTodo,
       completed: false
     })
   },
   EDIT_TODO(state, todo){
      var todos = state.todos
      todos.splice(todos.indexOf(todo), 1)
      state.todos = todos
      state.newTodo = todo.body
   },
   REMOVE_TODO(state, todo){
      var todos = state.todos
      todos.splice(todos.indexOf(todo), 1)
   },
   COMPLETE_TODO(state, todo){
     todo.completed = !todo.completed
   },
   CLEAR_TODO(state){
     state.newTodo = ''
     console.log('clearing new todo')
   }
  },
 actions: {
   getTodo({commit}, todo){
     commit('GET_TODO', todo)
   },
   addTodo({commit}){
     commit('ADD_TODO')
   },
   editTodo({commit}, todo){
     commit('EDIT_TODO', todo)
   },
   removeTodo({commit}, todo){
     commit('REMOVE_TODO', todo)
   },
   completeTodo({commit}, todo){
    commit('COMPLETE_TODO', todo)
   },
   clearTodo({commit}){
     commit('CLEAR_TODO')
   }
  }
})

// localStorage persistence
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

// app Vue instance
var app = new Vue({
  store,

  // app initial state
  // data: {
  //   todos: todoStorage.fetch(),
  //   // newTodo: '',
  //   editedTodo: null,
  //   visibility: 'all'
  // },

  // watch todos change for localStorage persistence
  // watch: {
  //   todos: {
  //     handler: function (todos) {
  //       todoStorage.save(todos)
  //     },
  //     deep: true
  //   }
  // },

  // computed properties
  // https://vuejs.org/guide/computed.html
  computed: {
    newTodo()  {
      return this.$store.getters.newTodo
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo (e) {
      e.target.value = ''
      this.$store.dispatch('addTodo')
      this.$store.dispatch('clearTodo')
    },
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // https://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
app.$mount('.todoapp')
