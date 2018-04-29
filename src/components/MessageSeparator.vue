<template>
  <div class="message-separator">
    <span>{{ title }}</span>
  </div>
</template>
<script>
export default {
  name: 'MessageSeparator',
  props: ['title']
}
</script>
<style scoped>
  .message-separator{
    border-top: 1px solid #e2ecf4;
    position: relative;
    margin: 28px 0;
    display: flex;
    justify-content: center;
  }

  .message-separator span{
    background: #fff;
    position: absolute;
    top: -18px;
    padding: 5px 10px;
    font-weight: bold;
    border-radius: 10px;
  }
</style>