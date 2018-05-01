<template>
  <div>
    <app-sidebar></app-sidebar>
    <main v-if="task && taskOwner">
      <div class="toolbar"><h3>{{ task.title }}</h3></div>
      <app-messages :task="task" :taskOwner="taskOwner" :messages="messages"></app-messages>
      <div class="bottom">
        <form>
          <div class="message-area">
            <at-tooltip placement="top" content="Add files"><at-button><i class="icon icon-paperclip"></i></at-button></at-tooltip>
            <textarea 
              rows="1" 
              v-model="msg" 
              placeholder="Write something and press ENTER" 
              @keydown.enter="onSubmit"></textarea>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>
<script>
import store from '../store';
import vm from '../main';
import * as autosize from 'autosize';

export default {
  name: 'TaskOne',
  data() {
    return {
      msg: ''
    }
  },
  mounted: function() {
    setInterval(() => { autosize(document.querySelectorAll('textarea')); }, 500);
  },
  computed: {
    task() {
      return this.$store.state.current_task;
    },
    taskOwner() {
      return this.$store.state.current_task_owner;
    },
    messages() {
      return this.$store.state.messages;
    }
  },
  methods: {
    onSubmit(e) {
      if (!e.shiftKey) {
        this.$socket.emit(
          'message_add', 
          {
            token: this.$store.state.user.token,
            message: e.target.value,
            task_id: this.$store.state.current_task._id
          }
        );
        this.msg = '';
        e.preventDefault();
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    store.commit('setCurrentTask', to.params.task_id);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    store.commit('setCurrentTask', to.params.task_id);
    next();
  }
}
</script>
<style scoped>
main{
  position: fixed;
  top: 0;
  left: 240px;
  bottom: 0;
  right: 0;
}

.toolbar{
  width: 100%;
  height: 56px;
  border-bottom: 1px solid #e2ecf4;
  box-sizing: border-box;
  padding: 0 20px;
}

.toolbar h3{
  line-height: 56px;
}

.bottom{
  padding: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.message-area{
  border: 1px solid #C5D9E8;
  border-radius: 3px;
  display: flex;
}

.message-area button{
  border: 0;
  border-radius: 0;
  width: 38px;
  padding: 0;
  border-right: 1px solid #C5D9E8;
}

.message-area button i{
  position: absolute;
  bottom: 10px;
  left: 13px;
}

.message-area .at-tooltip__trigger,
.message-area .at-tooltip__trigger button{
  height: 100%;
}

.message-area .at-textarea .at-textarea__original{
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  min-height: 39px;
  border-color: red;
  border: 0;
}

.message-area .at-textarea{
  flex: 1;
}

.message-area textarea{
  border: 0;
  resize: none;
  font-size: 14px;
  padding: 8px;
  flex: 1;
}

.message-area textarea:focus{
  outline: 0;
}
</style>
<style>
  

  .message-area .at-tooltip__trigger{
    height: 100%;
  }
</style>