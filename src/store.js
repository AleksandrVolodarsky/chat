import Vue from 'vue'
import Vuex from 'vuex'
import vm from './main';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    users: null,
    tasks: null,
    messages: null,
    current_task_id: null,
    current_task: null,
    current_task_owner: null,
    current_task_messages: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    setMessages(state, messages) {
      console.log(messages);
      state.messages = messages;
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
    },
    setCurrentTaskOwner(state) {
      if (state.users instanceof Array && state.current_task) {
        let owner_obj = state.users.filter(u => u._id == state.current_task.owner);
        if (owner_obj instanceof Array) { 
          owner_obj = owner_obj[0];
        }
        state.current_task_owner = owner_obj;
      }
    }
  },
  actions: {
    requestTasks(context) {
      if (context.state.user && context.state.user.token) {
        vm.$socket.emit('task_all', { token: context.state.user.token });
      }
    },
    requestUsers(context) {
      if (context.state.user && context.state.user.token) {
        vm.$socket.emit('users_all', { token: context.state.user.token });
      }
    },
    requestMessages(context, task_id) {
      if (context.state.tasks) {
        vm.$socket.emit(
          'messages',
          {
            token: vm.$store.state.user.token,
            task_id: task_id
          }
        );
      }
    }
  }
})