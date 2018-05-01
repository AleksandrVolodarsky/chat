<template>
  <div class="first-row row no-gutter">
    <div class="col-md-1"><app-avatar v-bind:name="message.owner_obj.name" url=""></app-avatar></div>
    <div class="col-md-23">
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
  .first-row{
    padding: 5px 20px;
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