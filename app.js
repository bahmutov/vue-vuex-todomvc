/* global Vue, Vuex, axios */
;(function () {
  Vue.use(Vuex)

  function randomId () {
    return Math.random()
      .toString(16)
      .substr(2, 10)
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
      SET_LOADING (state, flag) {
        state.loading = flag
      },
      SET_TODOS (state, todos) {
        state.todos = todos
      },
      GET_TODO (state, todo) {
        state.newTodo = todo
      },
      ADD_TODO (state, todoObject) {
        console.log('add todo', todoObject)
        state.todos.push(todoObject)
      },
      REMOVE_TODO (state, todo) {
        var todos = state.todos
        todos.splice(todos.indexOf(todo), 1)
      },
      COMPLETE_TODO (state, todo) {
        todo.completed = !todo.completed
      },
      CLEAR_TODO (state) {
        state.newTodo = ''
        console.log('clearing new todo')
      }
    },
    actions: {
      loadTodos ({ commit }) {
        commit('SET_LOADING', true)
        axios
          .get('todos')
          .then(r => r.data)
          .then(todos => {
            commit('SET_TODOS', todos)
            commit('SET_LOADING', false)
          })
      },
      getTodo ({ commit }, todo) {
        commit('GET_TODO', todo)
      },
      addTodo ({ commit, state }) {
        if (!state.newTodo) {
          // do not add empty todos
          return
        }
        const todo = {
          title: state.newTodo,
          completed: false,
          id: randomId()
        }
        axios.post('todos', todo).then(_ => {
          console.log('posted to server')
          commit('ADD_TODO', todo)
        })
      },
      removeTodo ({ commit }, todo) {
        axios.delete(`todos/${todo.id}`).then(_ => {
          console.log('removed todo', todo.id, 'from the server')
          commit('REMOVE_TODO', todo)
        })
      },
      clearTodo ({ commit }) {
        commit('CLEAR_TODO')
      }
    }
  })

  // app Vue instance
  const app = new Vue({
    store,
    el: '.todoapp',

    created () {
      this.$store.dispatch('loadTodos')
    },

    // computed properties
    // https://vuejs.org/guide/computed.html
    computed: {
      newTodo () {
        return this.$store.getters.newTodo
      },
      todos () {
        return this.$store.getters.todos
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

      removeTodo (todo) {
        console.log('removing todo')
        console.log(todo)
        this.$store.dispatch('removeTodo', todo)
      }
    }
  })

  window.app = app
})()
