<template>
  <div class="sidebar-participant">
    <div class="badge"></div>
    <app-avatar v-bind:name="user.name" :size="20" :radius="2"></app-avatar>
    
    <b>{{ user.name }}</b>
    <span class="remove" @click="remove"><i class="icon icon-x"></i></span>
  </div>
</template>
<script>
export default {
  name: 'SidebarParticipant',
  props: ['user_id'],
  computed: {
    user() {
      console.log(this.user_id);
      return this.$store.state.users.find(u => u._id == this.user_id);
    }
  },
  methods: {
    remove() {
      this.$Modal.confirm({
        title: `Remove ${ this.user.name } participant`,
        content: 'This operation needs to be very careful. Are you sure you want to do this?'
      })
      .then(
        () => {
          this.$socket.emit(
            'participant_remove', 
            { 
              token: this.$store.state.user.token,
              task_id: this.$store.state.current_task._id,
              id: this.user._id
            }
          );
        }
      )
    }
  }
}
</script>
<style>
  .sidebar-participant{
    display: flex;
    align-items: center;
    line-height: 30px;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 0 5px;
    border-radius: 2px;
  }

  .sidebar-participant .remove{
    display: none;
  }

  .sidebar-participant:hover{
    border: 1px solid #c5d9e8;
    background: #f3f7fa;
  }

  .sidebar-participant:hover .remove{
    display: block;
  }

  .sidebar-participant .badge{
    background: #13CE66;
    border-radius: 100%;
    width: 9px;
    height: 9px;
    margin-right: 7px;
  }

  .sidebar-participant b{
    margin-right: auto;
  }

  .sidebar-participant .avatar{
    margin-right: 7px;
  }
  .sidebar-participant .at-badge--corner{
    left: -15px;
    top: 6px;
  }
</style>