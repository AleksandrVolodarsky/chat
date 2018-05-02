<template>
  <div class="sidebar">
    <at-menu mode="vertical" active-name="1" @on-select="clickMenu">
      <at-menu-item name="1"><i class="icon icon-home"></i>Navigation One</at-menu-item>
      <at-menu-item name="2"><i class="icon icon-layers"></i>Navigation Two</at-menu-item>
      <at-menu-item name="logout"><i class="icon icon-power"></i>Log out</at-menu-item>
      <h2><router-link to="/tasks">Tasks</router-link><router-link to="/task/add"><i class="icon icon-plus-circle"></i></router-link></h2>
      <at-menu-item
        v-if="$store.state.tasks"
        v-for="task in $store.state.tasks" 
        :key="task._id"
        v-bind:to="'/task/one/' + task._id">{{ task.title }}</at-menu-item>
    </at-menu>
  </div>
</template>
<script>
export default {
  name: 'Sidebar',
  methods: {
    clickMenu(name) {
      if (this[name]) {
        this[name]();
      }
    },
    logout() {
      window.localStorage.removeItem('cn_user');
      this.$router.push('/login');
    }
  }
}
</script>
<style scoped>
  h2{
    padding: 12px 32px;
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
</style>