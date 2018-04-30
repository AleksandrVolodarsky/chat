<template>
  <div class="app flex-center flex-middle">
    <div class="form-content">
      <h1>Registration</h1>
      <div class="subtitle">Create a <b>Coding Ninjas</b> account.
        Registration confirmation will be emailed to you.</div>
      <form v-on:submit.prevent="onSubmit">
        <label>Your name <at-input v-model="name" size="large" placeholder="Name"></at-input></label>
        <label>Email <at-input v-model="login" type="email" size="large" placeholder="We will use it for authorization"></at-input></label>
        <label>Password <at-input v-model="password" type="password" size="large" placeholder="Minimum of 5 characters"></at-input></label>
        <div class="row">
          <div class="col-md-18">
            <at-checkbox v-model="i_agree" label="Shenzhen">I agree to <a _ngcontent-c4="" routerlink="/terms" ng-reflect-router-link="/terms" href="/terms">terms of use</a> and <a _ngcontent-c4="" routerlink="/pp" ng-reflect-router-link="/pp" href="/pp">privacy policy</a></at-checkbox>
          </div>
          <div class="col-md-6 flex flex-end flex-middle">
            <at-button type="primary" nativeType="submit" :disabled="!valid">Registration</at-button>
          </div>
        </div>
        <app-or-separator></app-or-separator>
        <ul class="or-links">
            <li><router-link to="/lost-password">Lost your password?</router-link></li>
            <li><router-link to="/login">Login</router-link></li>
        </ul>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Registration',
  data() {
    return {
      login: '',
      name: '',
      password: '',
      i_agree: true
    }
  },
  methods: {
    onSubmit(event) {
      if (!this.valid) return false;
      this.$socket.emit(
        'registration',
        {
          email: this.login,
          password: this.password,
          name: this.name
        },
        v => {
          this.$Message.success('Thank you! Registration complete.');
          this.$router.push('/login');
        }
      );
    }
  },
  computed: {
    valid(){
      return this.login != '' && this.name != '' && this.password.length > 4 && this.i_agree != false;
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