<template>
  <div v-if="files.length > 0" class="files">
    <div 
      v-for="file in files" 
      :key="file.id"
      :style="getImageStyle(file)"
      :class="{ doc: !isImage(file) }"
      class="file">
      
      <i v-if="!isImage(file)" class="icon icon-file-text"></i>
      <div @click="remove(file)" class="overlay"><i class="icon icon-trash"></i></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MessageFilesManager',
  props: ['files'],
  methods: {
    remove(file) {
      this.$emit('remove', file)
    },
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
    }
  }
}
</script>
<style scoped>
  .files{
    display: flex;
    flex-wrap: wrap;
    padding: 0 0 10px 0;
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

  .file.doc:hover i.icon-file-text{
    opacity: 0;
  }
</style>