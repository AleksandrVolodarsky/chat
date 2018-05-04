<template>
  <div class="app flex-center flex-middle">
    <app-esc></app-esc>
    <div class="form-content">
      <h1>Add a task</h1>
      <form v-on:submit.prevent="onSubmit">
        <label>Task title <at-input v-model="title" size="large" type="text" placeholder="Title"></at-input></label>
        <label>Task description <at-textarea v-model="description" placeholder="Write a few words about your task ( min 25 symbols )."></at-textarea></label>
        <div class="row flex flex-end flex-middle">
          <at-button type="primary" nativeType="submit" :disabled="!valid">Add</at-button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TaskAdd',
  data() {
    return {
      title: '',
      description: ''
    }
  },
  methods: {
    onSubmit(event) {
      if (!this.valid) return false;
      this.$socket.emit(
        'task_add',
        {
          title: this.title,
          description: this.description,
          token: this.$store.state.user.token
        },
        t => {
          this.$router.push(`/task/one/${ t.insertedIds[0] }`);
          this.$store.commit('addTask', t.ops[0]);
          this.$Message.success('Task successfully added!');
        }
      );
    }
  },
  computed: {
    valid(){
      return this.title != '' && this.description.length > 24;
    }
  }
}
</script>
<style scoped>
  .app {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fafafa;
    display: flex;
  }
  h1{
    font-size: 44px;
    font-weight: 200;
  }

  .form-content{
    width: 450px;
    text-align: left;
    margin-top: -50px;
  }

  .form-content form{
    margin-top: 20px;
  }

  .form-content label{
    margin-bottom: 10px;
    display: block;
    line-height: 26px;
  }
  .or-links{
    text-align: center;
  }

  .or-links li{
    display: inline-block;
  }

  .or-links li:first-child:after{
    content: ' |';
    color: rgba(0, 0, 0, 0.1);
  }
</style>