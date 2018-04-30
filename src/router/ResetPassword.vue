<template>
  <div class="app flex-center flex-middle">
    <div class="form-content">
      <h1>Pick a new password</h1>
      <form v-on:submit.prevent="onSubmit">
        <label>Password <at-input v-model="password" type="password" size="large" placeholder="Credentials"></at-input></label>
        <div class="row flex flex-end flex-middle">
          <at-button type="primary" nativeType="submit" :disabled="!valid">Reset password</at-button>
        </div>
        <app-or-separator></app-or-separator>
        <ul class="or-links">
            <li><router-link to="/lost-password">Lost your password?</router-link></li>
            <li><router-link to="/registration">Registration</router-link></li>
        </ul>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      password: ''
    }
  },
  methods: {
    onSubmit(event) {
      if (!this.valid) return false;
      this.$socket.emit(
        'reset_password',
        {
          password: this.password,
          key: this.$route.params.id
        },
        v => {
          this.$Message.success('Success! You changed your password!');
          this.$router.push('/login');
        }
      );
    }
  },
  computed: {
    valid(){
      return this.password.length > 4;
    }
  }
}
</script>
<style scope>
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
    width: 450px;
    text-align: left;
    margin-top: -50px;
  }

  .form-content form{
    margin-top: 20px;
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
</style>