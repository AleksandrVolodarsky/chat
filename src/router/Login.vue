<template>
  <div class="app flex-center flex-middle">
    <div class="form-content">
      <h1>Login</h1>
      <div class="subtitle">Sign into your <b>Coding Ninjas</b> account</div>
      <form v-on:submit.prevent="onSubmit">
        <label>Email <at-input v-model="login" size="large" type="email" placeholder="Username"></at-input></label>
        <label>Password <at-input v-model="password" type="password" size="large" placeholder="Credentials"></at-input></label>
        <div class="row flex flex-end flex-middle">
          <at-button type="primary" nativeType="submit" :disabled="!valid">Login</at-button>
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
  name: 'Login',
  data() {
    return {
      login: '',
      password: ''
    }
  },
  methods: {
    onSubmit(event) {
      if (!this.valid) return false;
      this.$socket.emit(
        'login',
        {
          email: this.login,
          password: this.password
        },
        u => {
          this.$store.commit('setUser', u);
          this.$router.push('/');
        }
      );
    }
  },
  computed: {
    valid(){
      return this.login != '' && this.password.length > 4;
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