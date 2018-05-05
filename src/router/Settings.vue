<template>
  <div class="app flex-center flex-middle">
    <app-esc></app-esc>
    <div class="form-content">
      <h1>Settings</h1>
      <form v-on:submit.prevent="onSubmit">
        <div class="flex-row">
          <div class="left">
            <div 
              v-if="avatar"
              class="avatar-picker" 
              :style="{ backgroundImage: `url( ${ avatar } )` }"
              @click="pickAvatar">
              <div class="overlay"><i class="icon icon-upload-cloud"></i></div>
            </div>
            <div 
              v-if="!avatar"
              class="avatar-picker" 
              @click="pickAvatar">
              <div class="overlay"><i class="icon icon-upload-cloud"></i></div>
            </div>
          </div>
          <div class="right">
            <label>Your name <at-input v-model="name" size="large" type="text" placeholder="Name"></at-input></label>
            <label>Email <at-input v-model="email" size="large" type="email" placeholder="Email"></at-input></label>
          </div>
        </div>
        <label>New password <at-input v-model="password" size="large" type="text" placeholder="Minimum of 5 characters"></at-input></label>
        <div class="row flex flex-end flex-middle">
          <at-button type="primary" nativeType="submit" :disabled="!valid">Save</at-button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Settings',
  data() {
    return {
      email: this.$store.state.user.email,
      password: '',
      name: this.$store.state.user.name,
      avatar: this.$store.state.user.avatar || '',
      filepicker: window.filepicker
    }
  },
  created() {
    this.filepicker.setKey('AGMv9OYHwTG6M8UT9foDxz');
  },
  methods: {
    onSubmit(event) {
      if (!this.valid) return false;
      this.$socket.emit(
        'update_settings',
        {
          token: this.$store.state.user.token,
          email: this.email,
          password: this.password,
          name: this.name,
          avatar: this.avatar,
        },
        user => {
          this.$store.commit('setUser', user);
        }
      );
    },
    pickAvatar() {
      this.filepicker.pick(
        {
          key: 'AGMv9OYHwTG6M8UT9foDxz',
          extensions: ['.jpg', '.jpeg', '.png', '.gif'],
          max_size: 62914560,
          max_files: 15
        },
        avatar => {
          this.avatar = avatar.url;
        }
      );
    }
  },
  computed: {
    valid(){
      return this.password == '' || this.password.length > 4;
    }
  }
}
</script>
<style scoped>
  .app {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fafafa;
    display: flex;
  }
  h1{
    font-size: 44px;
    font-weight: 200;
  }

  .form-content{
    width: 550px;
    text-align: left;
    margin-top: -50px;
  }

  .form-content form{
    margin-top: 20px;
  }

  .form-content form .flex-row{
    display: flex;
  }

  .form-content form .flex-row .left{
    flex-basis: 128px;
  }

  .form-content form .flex-row .right{
    flex: 1;
  }

  .form-content label{
    margin-bottom: 10px;
    display: block;
    line-height: 26px;
  }
  .or-links{
    text-align: center;
  }

  .or-links li{
    display: inline-block;
  }

  .or-links li:first-child:after{
    content: ' |';
    color: rgba(0, 0, 0, 0.1);
  }

  .avatar-picker{
    background-image: url("https://api.adorable.io/avatars/50/test@adorable.io.png");
    width: 108px;
    height: 108px;
    border-radius: 4px;
    background-size: cover;
    margin-top: 25px;
    cursor: pointer;
    position: relative;
  }

  .avatar-picker .overlay{
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
    border-radius: 4px;
    font-size: 24px;
  }

  .avatar-picker:hover .overlay{
    opacity: 1;
  }
</style>