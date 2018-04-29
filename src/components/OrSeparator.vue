<template>
  <div class="or-separator">
    <span>or</span>
  </div>
</template>
<script>
export default {
  name: 'OrSeparator'
}
</script>
<style scoped>
  .or-separator{
    border-top: 1px solid #e2ecf4;
    text-align: center;
    position: relative;
    margin: 20px 0;
  }

  .or-separator span{
    background: #fafafa;
    color: #E5E5E5;
    position: relative;
    top: -12px;
    padding: 0 5px;
  }
</style>