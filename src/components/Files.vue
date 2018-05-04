<template>
  <div v-if="files && files.length > 0" class="files">
    <div 
      v-for="(file, index) in files" 
      :key="index"
      :style="getImageStyle(file)"
      :class="{ doc: !isImage(file) }"
      @click="open(file)"
      class="file">
      
      <i v-if="!isImage(file)" class="icon icon-file-text"></i>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Files',
  props: ['files'],
  methods: {
    isImage(file) {
      return file.mimetype.indexOf('image') > -1;
    },
    getImageStyle(file) {
      if (this.isImage(file)) {
        return {
          backgroundImage: `url( ${ file.url } )`
        };
      }
      return {};
    },
    open(file) {
      window.location = file.url;
    }
  }
}
</script>
<style scoped>
  .files{
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0 0 0;
  }

  .file{
    flex-basis: 60px;
    height: 60px;
    background-size: cover;
    margin-right: 10px;
    cursor: pointer;
    position: relative;
  }

  .file:hover .overlay{
    opacity: 1;
  }

  .file .overlay{
    opacity: 0;
    transition: 0.3s all;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .file.doc{
    background: #FAFBFC;
    border: 1px solid #EEF0F0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #EEF0F0;
  }
</style>