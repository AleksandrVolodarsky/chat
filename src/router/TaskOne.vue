<template>
  <div>
    <app-sidebar></app-sidebar>
    <main v-if="task && taskOwner">
      <div class="toolbar">
        <h3>{{ task.title }}</h3>
        <ul class="buttons">
          <li v-if="starred_messages.length > 0" @click="toggleRightSidebar('starred')"><i class="icon icon-star"></i></li>
          <li @click="toggleRightSidebar('info')" :class="{ active: showed_sidebar_right == 'info' }"><i class="icon icon-info"></i></li>
          <li v-if="all_files.length > 0" @click="toggleRightSidebar('files')" :class="{ active: showed_sidebar_right == 'files' }"><i class="icon icon-layers"></i></li>
        </ul>
      </div>
      <div class="content-area">
        <div class="first-col">

          <div class="messages" v-if="task && taskOwner">
            <div class="first-row">
              <div class="left"><app-avatar v-bind:name="taskOwner.name" :url="taskOwner.avatar"></app-avatar></div>
              <div class="right">
                <div class="title">
                  <b>{{ taskOwner.name }}</b>
                  <at-tooltip v-if="task.created" placement="top-left" :content="task.created"><span class="time"> {{ task.created | moment("h:mm A") }}</span></at-tooltip>
                </div>
                <div class="description">
                  {{ task.description }}
                </div>
              </div>
            </div>
            <app-messages :messages="messages"></app-messages>
          </div>

          <div class="bottom">
            <files-manager @remove="removeFile" :files="files"></files-manager>
            <form>
              <div class="message-area">
                <at-tooltip placement="top" content="Add files">
                  <at-button @click="pickFiles"><i class="icon icon-paperclip"></i></at-button>
                </at-tooltip>
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
            <at-select :disabled="posible_participants.length == 0" size="large" @on-change="participantChange">
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
        <app-right-sidebar 
          v-if="showed_sidebar_right == 'files'"
          title="All task files" 
          @exit="toggleRightSidebar('files')">
          
          <app-files :files="all_files"></app-files>
        </app-right-sidebar>
      </div>
    </main>
  </div>
</template>
<script>
import store from '../store';
import vm from '../main';
import * as autosize from 'autosize';
import MessageFilesManager from '../components/MessageFilesManager';

export default {
  name: 'TaskOne',
  components: {
    'files-manager': MessageFilesManager
  },
  data() {
    return {
      msg: '',
      files: [],
      filepicker: window.filepicker,
      participant: ''
    }
  },
  created() {
    this.filepicker.setKey('AGMv9OYHwTG6M8UT9foDxz');
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
    all_files() {
      let files = [];
      if (this.task.files instanceof Array && this.task.files.length) {
        files = files.concat(this.task.files);
      }
      if (this.messages instanceof Array && this.messages.length) {
        this.messages.map(
          m => {
            if (m.files instanceof Array && m.files.length) {
              files = files.concat(m.files);
            }
          }
        );
      }
      return files;
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

      ret = ret.filter(id => id._id != this.$store.state.user._id);
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
            task_id: this.$store.state.current_task._id,
            message: e.target.value,
            files: this.files
          }
        );
        this.msg   = '';
        this.files = [];
        e.preventDefault();
      }
    },
    participantChange(v) {
      if (!v) { return }
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
    },
    pickFiles() {
      window.filepicker.pickMultiple(
        {
          key: 'AGMv9OYHwTG6M8UT9foDxz',
          extensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'],
          max_size: 62914560,
          max_files: 15
        },
        files => {
          this.files = files;
        }
      );
    },
    removeFile(file) {
      this.files = this.files.filter(f => f.id != file.id);
    }
  },
  beforeRouteEnter(to, from, next) {
    store
      .dispatch('isAllowToTask', to.params.task_id)
      .then(
        task => {
          store.commit('setCurrentTask', to.params.task_id);
          store.commit('setTasks', store.state.tasks);
          store.dispatch('requestMessages', to.params.task_id);
          next();
        }
      )
      .catch(
        err => {
          next('/');
        }
      )
  },
  beforeRouteUpdate(to, from, next) {
    store
      .dispatch('isAllowToTask', to.params.task_id)
      .then(
        task => {
          store.commit('setCurrentTask', to.params.task_id);
          store.commit('setTasks', store.state.tasks);
          store.dispatch('requestMessages', to.params.task_id);
          next();
        }
      )
      .catch(
        err => {
          next('/');
        }
      )
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

.messages{
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
}

.first-row{
  padding: 20px;
  margin-right: 0;
  margin-left: 0;
  display: flex;
}

.first-row .left{
  flex-basis: 42px;
}

.first-row .right{
  flex: 1;
}

.first-row .time{
  font-size: 12px;
  color: #3F536E;
}

.first-row .description{
  margin-top: 5px;
}

.first-row .title{
  line-height: 12px;
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
  .participants .at-select__input{
    z-index: 2;
  }
</style>