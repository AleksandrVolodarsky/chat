<template>
  <div class="right-sidebar">
    <header>
        <h2><b>{{ title }}</b></h2>
        <a><i class="icon icon-x"></i></a>
    </header>
    <div class="content">
        <div class="text">
          <slot></slot>
        </div>
    </div>
  </div> 
</template>
<script>
export default {
  name: 'RightSidebar',
  props: ['title']
}
</script>
<style scoped>
  .right-sidebar{
    flex-basis: 442px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #f3f7fa;
  }

  .right-sidebar header{
    flex-basis: 62px;
    border-bottom: 1px solid #f3f7fa;
    background: #FAFBFC;
    padding: 16px 12px;
    display: flex;
  }

  .right-sidebar header h2{
    margin-right: auto;
  }

  .right-sidebar header a{
    color: #2C405A;
    font-size: 20px;
    line-height: 20px;
  }

  .right-sidebar .text{
    padding: 16px 12px;
  }
</style>


