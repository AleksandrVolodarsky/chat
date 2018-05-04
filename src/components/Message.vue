<template>
  <div class="message" :class="{ same: same }">
    <div class="left">
      <app-avatar v-if="!same" v-bind:name="message.owner_obj.name" url=""></app-avatar>
      <at-tooltip v-if="same && message.created" placement="top-left" :content="message.created">
        <span class="time"> {{ message.created | moment("h:mm") }}</span> 
        <i 
          class="icon" 
          :class="{ 
            'icon-star' : !message.starred,
            'icon-star-on' : message.starred 
          }" 
          @click="toggleStar"></i>
      </at-tooltip>
    </div>
    <div class="right">
      <div v-if="!same" class="title">
        <b>{{ message.owner_obj.name }}</b>
        <at-tooltip v-if="message.created" placement="top-left" :content="message.created">
          <span class="time"> {{ message.created | moment("h:mm") }}</span> 
        </at-tooltip>
        <i 
          class="icon" 
          :class="{ 
            'icon-star' : !message.starred,
            'icon-star-on' : message.starred 
          }" 
          @click="toggleStar"></i>
      </div>
      <div class="description" :class="{ mt: !same }">
        {{ message.message }}
      </div>
      
      <app-files :files="message.files"></app-files>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Message',
  props: ['message', 'prev', 'index'],
  computed: {
    same() {
      return this.prev && this.message.owner == this.prev.owner;
    },
    images() {
      let images = [];
      if (this.message.files instanceof Array && this.message.files.length) {
        this.message.files.map(
          f => {
            images.push({
              imageUrl: f.url,
              caption: f.filename
            });
            return f;
          }
        );
      }
      return images;
    }
  },
  methods: {
    toggleStar() {
      this.$socket.emit(
        'message_star', 
        { 
          token: this.$store.state.user.token,
          message_id: this.message._id
        }
      );
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
    },
    open(file) {
      window.location = file.url;
    },
    isVisible() {
      let bcr = this.$el.getBoundingClientRect();
      return bcr.top >= 0 &&  bcr.bottom <= window.innerHeight;
    }
  }
}
</script>
<style scoped>
  .message{
    padding: 5px 20px;
    margin-right: 0;
    margin-left: 0;
    display: flex;
    line-height: 15px;
  }

  .message.same{
    padding: 5px 20px 5px 0;
  }

  .message .left{
    flex-basis: 42px;
    position: relative;
  }

  .message.same .left{
    flex-basis: 62px;
    text-align: right;
    padding-right: 9px;
  }

  .message:hover{
    background: #FAFBFC;
  }
  
  .message.same:hover .left .icon,
  .message.same:hover .left .time{
    display: inline-block;
  }

  .message.same .left .time{
    display: none;
    line-height: 12px;
  }

  .message .right{
    flex: 1;
  }

  .message .time{
    font-size: 12px;
    color: #3F536E;
  }

  .message .description{
    line-height: 22px;
  }

  .message .description.mt{
    margin-top: 5px;
  }

  .message .title{
    line-height: 12px;
  }
  .message .left .icon{
    display: none;
  }
  .message .left .icon, 
  .message .title .icon{
    font-size: 12px;
    line-height: 12px;
    cursor: pointer;
  }
  
  .message .left .icon:hover,
  .message .title .icon:hover{
    color: #FFDC00;
  }
</style>