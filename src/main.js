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
import Messages from './components/Messages'
import RightSidebar from './components/RightSidebar'
import * as moment from 'vue-moment';

Vue.use(AtUI);
Vue.use(moment);
Vue.component('app-or-separator', OrSeparator);
Vue.component('app-message', Message);
Vue.component('app-messages', Messages);
Vue.component('app-message-separator', MessageSeparator);
Vue.component('app-sidebar', Sidebar);
Vue.component('app-esc', Esc);
Vue.component('app-avatar', Avatar);
Vue.component('app-right-sidebar', RightSidebar);
Vue.use(VueSocketio, 'http://localhost:13665/', store);

Vue.config.productionTip = false

router.beforeEach(
  (to, from, next) => { 
    if (to.meta.requires_auth === true && (!store.state.user || !store.state.user.token)) {
      next('/login');
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
        this.$store
          .dispatch('requestUsers').then(
            (users) => {
              return this.$store.dispatch('requestTasks');
            }
          );
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
    }
  }
})

