import Vue from 'vue'
import Vuex from 'vuex'
import vm from './main';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    tasks: null,
    current_task_id: null,
    current_task: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, task) {
      if (!(state.tasks instanceof Array)) {
        state.tasks = [];
      }
      state.tasks.push(task);
    },
    setCurrentTask(state, task_id) {
      state.current_task_id = task_id;
      if (state.tasks instanceof Array) {
        let task = state.tasks.filter(t => t._id == task_id);
        if (task instanceof Array) { 
          task = task[0];
        }
        state.current_task = task;
      }
    }
  },
  actions: {
    requestTasks(context) {
      if (context.state.user && context.state.user.token) {
        vm.$socket.emit('task_all', { token: context.state.user.token });
      }
    }
  }
})