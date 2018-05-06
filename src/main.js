import Vue from 'vue'
import App from './App.vue'
import 'at-ui-style'
import AtUI from 'at-ui'
import router from './router'
import store from './store';
import VueSocketio from 'vue-socket.io';
import io from 'socket.io-client';
import OrSeparator from './components/OrSeparator'
import MessageSeparator from './components/MessageSeparator'
import Sidebar from './components/Sidebar'
import Esc from './components/Esc'
import Avatar from './components/Avatar'
import Message from './components/Message'
import Messages from './components/Messages'
import RightSidebar from './components/RightSidebar'
import SidebarParticipant from './components/SidebarParticipant'
import Files from './components/Files'
import FilterLog from './filters/log';
import VTooltip from 'v-tooltip'
import * as moment from 'vue-moment';

Vue.use(AtUI);
Vue.use(moment);
Vue.use(VTooltip);
VTooltip.options.autoHide = false;


Vue.component('app-or-separator', OrSeparator);
Vue.component('app-message', Message);
Vue.component('app-messages', Messages);
Vue.component('app-message-separator', MessageSeparator);
Vue.component('app-sidebar', Sidebar);
Vue.component('app-esc', Esc);
Vue.component('app-avatar', Avatar);
Vue.component('app-right-sidebar', RightSidebar);
Vue.component('app-sidebar-participant', SidebarParticipant);
Vue.component('app-files', Files);
Vue.filter('log', FilterLog);
Vue.use(VueSocketio, io('http://localhost:13665/', { query: { token: store.getters.token }}), store);
Vue.config.productionTip = false

router.beforeEach(
  (to, from, next) => { 
    
    if (to.meta.requires_auth === true) {
      if ((!store.state.user || !store.state.user.token)) {
        next('/login');
      } else {
        Promise.all([
          store.dispatch('requestUsers'),
          store.dispatch('requestTasks')
        ]).then(
          res => { next() }
        );
      }
    } else {
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
      if (this.$store.state.user && this.$store.state.user.token) {
        this.$store.commit('setCurrentTask', this.$store.state.current_task_id);
      }
      window['t'] = this;
    },
    banner_error: function(v) {
      this.$Message.error(v.msg);
      console.error(v);
    },
    message_add: function(m) {
      if (m.ops[0].task_id == this.$store.state.current_task._id) {
        this.$store.commit(
          'setMessages', 
          this.$store.state.messages.concat([m.ops[0]])
        );
      }
    },
    update_task: function(t) {
      this.$store
        .dispatch('requestTasks')
        .then(
          res => {
            return this.$store.dispatch('isAllowToTask', t._id)
          }
        )
        .then(
          task => {
            this.$store.commit('updateTask', t);
            this.$store.dispatch('updateCurrentTask');
          }
        )
        .catch(
          err => {
            this.$router.push('/');
          }
        )
    },
    users_all: function(users) {
      this.$store.commit('setUsers', users);
    },
    message_star: function(msg) {
      this.$store.commit('updateMessage', msg);
    }
  }
})

