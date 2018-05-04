<template>
  <div class="all-msgs">
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
  props: ['messages'],
  methods: {
    scrollToEnd() {
      document.getElementsByClassName('messages')[0].scrollTop = document.getElementsByClassName('messages')[0].scrollHeight;
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