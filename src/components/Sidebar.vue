<template>
  <div class="sidebar">
    <at-menu theme="dark" mode="vertical" active-name="1" @on-select="clickMenu">
      <div class="short-info">
        <div class="left">
          <app-avatar :size="40" :name="user.name" :url="user.avatar"></app-avatar>
        </div>
        <div class="right">
          <b>{{ user.name }}</b>
          <small><div class="badge" :class="{ active: isActive }"></div>{{ role }}</small>
        </div>
      </div>
      <at-menu-item to="/settings" name="settings"><i class="icon icon-settings"></i>Settings</at-menu-item>
      <at-menu-item name="logout"><i class="icon icon-power"></i>Log out</at-menu-item>
      <h2><router-link to="/tasks">Tasks</router-link><router-link to="/task/add"><i class="icon icon-plus-circle"></i></router-link></h2>
      <at-menu-item
        v-if="$store.state.tasks"
        v-for="task in $store.state.tasks" 
        :key="task._id"
        v-bind:to="'/task/one/' + task._id">{{ task.title }}<at-badge v-if="getUnreadCount(task) > 0" :value="getUnreadCount(task)"></at-badge></at-menu-item>
    </at-menu>
  </div>
</template>
<script>
export default {
  name: 'Sidebar',
  computed: {
    user() {
      return this.$store.state.user;
    },
    role() {
      return ['Administrator', 'Client', 'Freelancer'][this.user.role];
    },
    isActive() {
      return this.$store.getters.isOnline(this.user._id);
    }
  },
  methods: {
    clickMenu(name) {
      if (this[name]) {
        this[name]();
      }
    },
    logout() {
      window.localStorage.removeItem('cn_user');
      this.$router.push('/login');
      this.$store.commit('setUser', null);
    },
    getUnreadCount(task) {
      let last_read_index = 0;
      if (this.user.last_read_index && this.user.last_read_index[task._id]) {
        last_read_index = parseInt(this.user.last_read_index[task._id]) || 0;
      }
      return task.messages_count - last_read_index;
    }
  }
}
</script>
<style scoped>
  h2{
    padding: 12px 16px 12px 32px;
    color: #8DABC4;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  h2 i.icon{
    float: right;
    font-size: 14px;
  }
  .at-menu{
    position: fixed;
    height: 100%;
    overflow-y: auto;
  }

  .at-menu__item .at-badge{
    float: right;
  }

  .sidebar .short-info{
    display: flex;
    padding: 22px 16px 12px 32px;
  }

  .sidebar .short-info .left{
    flex-basis: 50px;
  }
  
  .sidebar .short-info .right{
    flex: 1;
    line-height: 15px;
    display: flex;
    flex-direction: column;
  }

  .sidebar .short-info .right small{
    line-height: 20px;
  }

  .sidebar .badge{
    background: #EEF0F0;
    border-radius: 100%;
    width: 9px;
    height: 9px;
    margin-right: 7px;
    display: inline-block;
  }

  .sidebar .badge.active{
    background: #13CE66;
  }
</style>