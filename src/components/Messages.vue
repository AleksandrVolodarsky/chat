<template>
  <div class="messages" v-if="task && taskOwner">
    <div v-if="show_first_message" class="first-row">
      <div class="left"><app-avatar v-bind:name="task.owner" url=""></app-avatar></div>
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
    <app-message 
      v-if="messages"
      v-for="(message, index) in messages"
      :index="index"
      :message="message"
      :prev="messages[index-1]"
      :key="message._id"></app-message>
  </div>
</template>
<script>
import * as _ from 'lodash';

export default {
  name: 'Messages',
  props: ['messages', 'task', 'taskOwner', 'show_first_message'],
  methods: {
    scrollToEnd() {
      this.$el.scrollTop = this.$el.scrollHeight;
    }
  },
  updated() {
    console.log('updated', this.messages.length);
    this.scrollToEnd();
  },
  mounted() {
    this.scrollToEnd();
  }
}
</script>
<style scoped>
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
</style>