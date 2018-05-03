import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('cn_user')),
    users: null,
    online_offline_ids: [],
    tasks: null,
    messages: null,
    current_task_id: null,
    current_task: null,
    current_task_owner: null,
    current_task_messages: null,
    is_show_sidebar_info: window.localStorage.getItem('cn_is_show_sidebar_info')
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
    updateMessage(state, message) {
      if (message._id) {
        let index = state.messages.findIndex(m => m._id == message._id);
        if (index > -1) {
          message.owner_obj = state.users.find(u => u._id == message.owner);
          state.messages[ index ] = message;
        }
      }
    },
    addTask(state, task) {
      if (!(state.tasks instanceof Array)) {
        state.tasks = [];
      }
      state.tasks.push(task);
    },
    setCurrentTask(state, task_id) {
      if (!task_id) { return false; }
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
    },
    SOCKET_ONLINE_OFFLINE(state, ids) {
      state.online_offline_ids = ids[0];
    },
    setIsShowSidebarInfo(state, is_show) {
      state.is_show_sidebar_info = is_show;
      window.localStorage.setItem('cn_is_show_sidebar_info', state.is_show_sidebar_info);
    }
  },
  getters: {
    token: state => {
      if (state.user && state.user.token) {
        return state.user.token;
      }
      return null;
    },
    isOnline: (state) => (id) => {
      return state.online_offline_ids.indexOf(id) > -1;
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