import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

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
    showed_sidebar_right: window.localStorage.getItem('cn_showed_sidebar_right')
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
      if (state.tasks instanceof Array) {
        let task = state.tasks.filter(t => t._id == task_id);
        if (task instanceof Array && task.length > 0) { 
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
        this.dispatch('read');
      }
    },
    SOCKET_ONLINE_OFFLINE(state, ids) {
      state.online_offline_ids = ids[0];
    },
    setShowedSidebarRight(state, name) {
      state.showed_sidebar_right = name;
      window.localStorage.setItem('cn_showed_sidebar_right', name);
    }
  },
  getters: {
    token: state => {
      if (state.user && state.user.token) {
        return state.user.token;
      }
      return null;
    },
    starred_messages: state => {
      if (state.messages instanceof Array) {
        return state.messages.filter(m => m.starred == true);
      }
      return [];
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
    },
    read(context) {
      let last_read_index, task;

      last_read_index = context.state.user.last_read_index || {};
      task            = context.state.current_task;

      if (last_read_index[task._id] != task.messages_count) {
        Vue.set(last_read_index, task._id, task.messages_count);
        Vue.set(context.state.user, 'last_read_index', last_read_index);
        this._vm.$socket.emit(
          'read',
          {
            token: context.state.user.token,
            task_id: task._id
          }
        )
        this.commit('setUser', context.state.user);
      }
    },
    isAllowToTask(context, task_id) {
      return new Promise(
        (resolve, reject) => {
          if (context.state.tasks instanceof Array) {
            let t = context.state.tasks.find(t => t._id == task_id);
            if (t) {
              return resolve(t);
            }
            throw new Error(t);
          }
        }
      )
    }
  }
})