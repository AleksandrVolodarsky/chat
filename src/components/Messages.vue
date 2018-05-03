<template>
  <div class="messages" v-if="task && taskOwner">
    <div class="first-row">
      <div class="left"><app-avatar v-bind:name="task.owner" url=""></app-avatar></div>
      <div class="right">
        <div class="title">
          <b>{{ taskOwner.name }}</b>
          <at-tooltip placement="top" content="information"><span class="time"> 12:38 PM</span></at-tooltip>
        </div>
        <div class="description">
          {{ task.description }}
        </div>
      </div>
    </div>
    <app-message-separator title="Description"></app-message-separator>
    <app-message 
      v-if="messages"
      v-for="(message, index) in messages"
      v-bind:message="message"
      v-bind:prev="messages[index-1]"
      :key="message._id"></app-message>
  </div>
</template>
<script>
export default {
  name: 'Messages',
  props: ['messages', 'task', 'taskOwner'],
  methods: {
    scrollToEnd() {
      this.$el.scrollTop = this.$el.scrollHeight;
    }
  },
  updated() {
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