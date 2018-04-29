<template>
  <a class="esc" @click="prev"><span>esc</span></a>
</template>
<script>
import * as _ from 'lodash'
export default {
  name: 'Esc',
  data() {
    return {
      key_down_listener: _.debounce(
        e => this.keyDown(e), 
        200,
        {
          lading: true
        }
      )
    };
  },
  created: function() {
    window.addEventListener('keydown', this.key_down_listener); 
  },
  methods: {
    prev() {
        this.$router.go(-1);
    },
    keyDown(e) {
      if(e.keyCode == 27) {
        this.prev();
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.key_down_listener);
  }
}
</script>
<style scoped>
  a.esc{
      color: #2c2c2c;
      position: fixed;
      top: 70px;
      right: 100px;
      width: 50px;
      height: 40px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
  }

  a.esc span{
      position: absolute;
      bottom: 0;
      left: 15px;
  }

  a.esc:before,
  a.esc:after{
      content: '';
      position: absolute;
      width: 2px;
      height: 25px;
      background: #2c2c2c;
      display: block;
      left: 25px;
      top: 0;
  }

  a.esc:after{
      transform: rotate(-45deg);
  }

  a.esc:before{
      transform: rotate(45deg);
  }
</style>
