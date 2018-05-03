<template>
  <div>
    <app-sidebar></app-sidebar>
    <main v-if="task && taskOwner">
      <div class="toolbar">
        <h3>{{ task.title }}</h3>
        <ul class="buttons">
          <li v-if="starred_messages.length > 0" @click="toggleRightSidebar('starred')"><i class="icon icon-star"></i></li>
          <li @click="toggleRightSidebar('info')" :class="{ active: showed_sidebar_right == 'info' }"><i class="icon icon-info"></i></li>
        </ul>
      </div>
      <div class="content-area">
        <div class="first-col">
          <app-messages 
            :show_first_message="true"
            :task="task" 
            :taskOwner="taskOwner" 
            :messages="messages"></app-messages>
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
        </div>
        <app-right-sidebar title="Info" v-if="showed_sidebar_right == 'info'" @exit="toggleRightSidebar('info')">
          <label class="participants">Participants 
            <at-select filterable size="large" v-on:on-change="participantChange">
              <at-option 
                v-for="user in posible_participants" 
                :value="user._id" 
                :key="user._id">{{ user.name }}</at-option>
            </at-select>
          </label>
          <span v-if="task.participants" class="participants-list">
            <app-sidebar-participant
              v-for="participant in task.participants"
              :key="participant"
              :user_id="participant"></app-sidebar-participant>
          </span>
        </app-right-sidebar>
        <app-right-sidebar 
          v-if="showed_sidebar_right == 'starred'"
          title="Starred messages" 
          @exit="toggleRightSidebar('starred')">
          <app-messages 
            :show_first_message="false"
            :task="task" 
            :taskOwner="taskOwner" 
            :messages="starred_messages"></app-messages>
        </app-right-sidebar>
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
    },
    starred_messages() {
      return this.$store.getters.starred_messages;
    },
    showed_sidebar_right() {
      return this.$store.state.showed_sidebar_right;
    },
    posible_participants() {
      let ret = [];
      if (this.$store.state.users instanceof Array) {
        if (this.task.participants instanceof Array) {
          ret = this.$store.state.users.filter(u => this.task.participants.indexOf(u._id) == -1);
        } else {
          ret = this.$store.state.users;
        }
      }
      return ret;
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
    },
    participantChange(v) {
      this.$socket.emit(
        'participant_add', 
        { 
          token: this.$store.state.user.token,
          task_id: this.$store.state.current_task._id,
          id: v
        }
      );
    },
    toggleRightSidebar(name) {
      if (this.showed_sidebar_right == name) {
        this.$store.commit('setShowedSidebarRight', '');
      } else {
        this.$store.commit('setShowedSidebarRight', name);
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
  display: flex;
  flex-direction: column;
}

.toolbar{
  width: 100%;
  flex-basis: 56px;
  border-bottom: 1px solid #e2ecf4;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
}

.toolbar h3{
  line-height: 56px;
  margin-right: auto;
}

.content-area{
  display: flex;
  flex: 1;
  flex-direction: row;
}

.content-area .first-col{
  display: flex;
  flex: 1;
  flex-direction: column;
}

.second-col{
  flex-basis: 442px;
  background: red;
}
.bottom{
  padding: 20px;
  order: 1;
  flex-shrink: 0;
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

.toolbar .buttons{
  margin: 0;
  padding: 0;
  list-style: none;
  cursor: pointer;
  font-size: 22px;
}

.toolbar .buttons li{
  padding: 0 10px;
  margin-top: 8px;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  display: inline-block;
}

.toolbar .buttons li.active,
.toolbar .buttons li:hover{
  background: #f3f7fa;
}

.participants-list{
  margin-top: 10px;
  display: block;
}

.participants{
  line-height: 26px;
}
</style>
<style>
  

  .message-area .at-tooltip__trigger{
    height: 100%;
  }
</style>