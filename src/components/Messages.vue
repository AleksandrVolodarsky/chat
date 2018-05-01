<template>
  <div class="messages" v-if="task && taskOwner">
    <div class="first-row row no-gutter">
      <div class="col-md-1"><app-avatar v-bind:name="task.owner" url=""></app-avatar></div>
      <div class="col-md-23">
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
      v-for="message in messages"
      v-bind:message="message"></app-message>
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
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 80px;
  overflow-y: auto;
}

.first-row{
  padding: 20px;
  margin-right: 0;
  margin-left: 0;
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