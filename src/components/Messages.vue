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
  props: ['messages', 'autoscroll'],
  data() {
    return {
      old_messages_count: -1
    };
  },
  methods: {
    scrollToEnd() {
      document.getElementsByClassName('messages')[0].scrollTop = document.getElementsByClassName('messages')[0].scrollHeight;
    }
  },
  updated() {
    if (this.autoscroll) {
      if (this.old_messages_count != this.messages.length) {
        this.scrollToEnd();
      }
      this.old_messages_count = this.messages.length;
    }
  },
  mounted() {
    if (this.autoscroll) {
      this.scrollToEnd();
      if (this.messages instanceof Array) {
        this.old_messages_count = this.messages.length;
      }
    }
  }
}
</script>