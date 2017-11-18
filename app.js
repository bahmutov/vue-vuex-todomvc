// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~150 lines.

Vue.use(Vuex)

function randomId () {
  return Math.random().toString(16).substr(2, 10)
}

const store = new Vuex.Store({
 state: {
    loading: true,
   todos: [],
   newTodo: ''
 },
 getters: {
  newTodo: state => state.newTodo,
  todos: state => state.todos
 },
 mutations: {
    SET_LOADING(state, flag) {
      state.loading = flag
    },
    SET_TODOS(state, todos) {
      state.todos = todos
    },
   GET_TODO(state, todo){
     state.newTodo = todo
   },
   ADD_TODO(state, todoObject){
      console.log('add todo', todoObject)
     state.todos.push(todoObject)
   },
   EDIT_TODO(state, todo){
      var todos = state.todos
      todos.splice(todos.indexOf(todo), 1)
      state.todos = todos
      state.newTodo = todo.title
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
    loadTodos({commit}) {
      commit('SET_LOADING', true)
      axios.get('http://localhost:3000/todos')
      .then(r => r.data)
      .then(todos => {
        commit('SET_TODOS', todos)
        commit('SET_LOADING', false)
      })
    },
   getTodo({commit}, todo){
     commit('GET_TODO', todo)
   },
   addTodo({commit, state}){
      const todo = {
       title: state.newTodo,
       completed: false,
       id: randomId()
     }
      axios.post('http://localhost:3000/todos', todo)
      .then(_ => {
        console.log('posted to server')
        commit('ADD_TODO', todo)
      })
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
// var STORAGE_KEY = 'todos-vuejs-2.0'
// var todoStorage = {
//   fetch: function () {
//     var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
//     todos.forEach(function (todo, index) {
//       todo.id = index
//     })
//     todoStorage.uid = todos.length
//     return todos
//   },
//   save: function (todos) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
//   }
// }

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

  created () {
    this.$store.dispatch('loadTodos')
  },

  // computed properties
  // https://vuejs.org/guide/computed.html
  computed: {
    newTodo()  {
      return this.$store.getters.newTodo
    },
    todos() {
      return this.$store.getters.todos
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
    setNewTodo (e) {
      this.$store.dispatch('getTodo', e.target.value)
    },

    addTodo (e) {
      e.target.value = ''
      this.$store.dispatch('addTodo')
      this.$store.dispatch('clearTodo')
    },

    editTodo (todo) {}
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
