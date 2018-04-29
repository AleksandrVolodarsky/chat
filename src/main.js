import Vue from 'vue'
import App from './App.vue'
import 'at-ui-style'
import AtUI from 'at-ui'
import router from './router'
import store from './store';
import VueSocketio from 'vue-socket.io';
import OrSeparator from './components/OrSeparator'
import MessageSeparator from './components/MessageSeparator'
import Sidebar from './components/Sidebar'
import Esc from './components/Esc'
import Avatar from './components/Avatar'
import Message from './components/Message'

Vue.use(AtUI)
Vue.component('app-or-separator', OrSeparator);
Vue.component('app-message-separator', MessageSeparator);
Vue.component('app-sidebar', Sidebar);
Vue.component('app-esc', Esc);
Vue.component('app-avatar', Avatar);
Vue.use(VueSocketio, 'http://localhost:13665/');

Vue.config.productionTip = false

router.beforeEach(
  (to, from, next) => { 
    const user = JSON.parse(window.localStorage.getItem('cn_user'));

    if (to.meta.requires_auth === true && (!user || !user.token)) {
      next('/login');
    } else {
      store.commit('setUser', user);
      next();
    }
  }
);

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  sockets:{
    connect: function(){
      console.info('Socket connected')
      this.$store.dispatch('requestTasks');
      this.$store.dispatch('requestUsers');
      window['t'] = this;
    },
    banner_error: function(v) {
      this.$Message.error(v.msg);
      console.error(v);
    },
    task_all: function(tasks) {
      this.$store.commit('setTasks', tasks);
    },
    users_all: function(users) {
      this.$store.commit('setUsers', users);
    },
    messages: function(messages) {
      this.$store.commit('setMessages', messages);
    }
  }
})

