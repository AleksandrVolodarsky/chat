<template>
  <div class="avatar" v-bind:style="style"></div>
</template>
<script>
import * as _ from 'lodash';

export default {
  name: 'Avatar',
  created: function() {
    // console.log('Sidebar created');
  },
  data() {
    return {
      local_url: this.url
    };
  },
  props: {
    url: {
      default: '',
      type: String
    },
    size: {
      default: 34,
      type: Number
    },
    name: {
      default: 'Jone',
      type: String
    },
    radius: {
      default: 3,
      type: Number
    }
  },
  computed: {
    style() {
      this.local_url = this.local_url || `https://api.adorable.io/avatars/${ this.size }/${ this.name }@adorable.io.png`;
      return `background-image: url("${ this.local_url }"); height: ${ this.size }px; width: ${ this.size }px; border-radius: ${ this.radius }px;`;
    }
  }
}
</script>
<style scoped>
  .avatar{
    display: block;
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>