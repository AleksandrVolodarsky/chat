<template>
  <div class="message">
    <div class="left"><app-avatar v-bind:name="message.owner_obj.name" url=""></app-avatar></div>
    <div class="right">
      <div class="title">
        <b>{{ message.owner_obj.name }}</b>
        <at-tooltip v-if="message.created" placement="top" :content="message.created"><span class="time"> {{ message.created | moment("MMMM Do YYYY, h:mm:ss a") }}</span></at-tooltip>
      </div>
      <div class="description">
        {{ message.message }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Message',
  props: ['message']
}
</script>
<style scoped>
  .message{
    padding: 5px 20px;
    margin-right: 0;
    margin-left: 0;
    display: flex;
  }

  .message .left{
    flex-basis: 42px;
  }

  .message .right{
    flex: 1;
  }

  .message .time{
    font-size: 12px;
    color: #3F536E;
  }

  .message .description{
    margin-top: 5px;
  }

  .message .title{
    line-height: 12px;
  }
</style>