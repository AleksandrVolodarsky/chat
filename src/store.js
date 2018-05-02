import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('cn_user')),
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
      window.localStorage.setItem('cn_user', JSON.stringify(user));
    },
    setUsers(state, users) {
      state.users = users;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    updateTask(state, task) {
      let t, index;
      index = state.tasks.findIndex(t => t._id == task._id);
      state.tasks[index] = task;
    },
    setMessages(state, v) {
      if (v instanceof Array) {
        v = v.map(
          v => {
            v.owner_obj = state.users.find(u => u._id == v.owner);
            return v;
          }
        );
      }
      state.messages = v;
    },
    addTask(state, task) {
      if (!(state.tasks instanceof Array)) {
        state.tasks = [];
      }
      state.tasks.push(task);
    },
    setCurrentTask(state, task_id) {
      state.current_task_id = task_id;
      this.dispatch('requestMessages', task_id);
      if (state.tasks instanceof Array) {
        let task = state.tasks.filter(t => t._id == task_id);
        if (task instanceof Array) { 
          task = task[0];
        }
        if (state.users instanceof Array) {
          let owner_obj = state.users.filter(u => u._id == task.owner);
          if (owner_obj instanceof Array) { 
            owner_obj = owner_obj[0];
          }
          state.current_task_owner = owner_obj;
        }
        state.current_task = task;
      }
    }
  },
  actions: {
    requestTasks(context) {
      return new Promise(
        (resolve, reject) => {
          this._vm.$socket.emit(
            'task_all', 
            { 
              token: context.state.user.token 
            },
            v => {
              context.commit('setTasks', v);
              resolve(v);
            }
          );
        }
      );
    },
    requestUsers(context) {
      return new Promise(
        (resolve, reject) => {
          this._vm.$socket.emit(
            'users_all', 
            { 
              token: context.state.user.token 
            },
            v => {
              context.commit('setUsers', v);
              resolve(v);
            }
          );
        }
      );
    },
    requestMessages(context, task_id) {
      return new Promise(
        (resolve, reject) => {
          this._vm.$socket.emit(
            'messages',
            {
              token: context.state.user.token,
              task_id: task_id
            },
            v => {
              context.commit('setMessages', v);
              resolve(v);
            }
          );
        }
      );
    },
    updateCurrentTask(context) {
      context.commit('setCurrentTask', context.state.current_task_id);
    }
  }
})