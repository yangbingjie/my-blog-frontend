<template>
  <div id="poster">
    <el-card class="login-form">
      <el-form>
        <h1 class="login-title">登录</h1>
        <el-form-item>
          <el-input type="text" v-model="loginForm.username"
                    auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="loginForm.password"
                    auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" v-on:click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      responseResult: []
    }
  },
  methods: {
    login () {
      var _this = this
      this.$axios
        .post('/user/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            console.log(successResponse.data.user)
            let user = successResponse.data.user
            user.username = _this.loginForm.username
            _this.$store.commit('login', user)
            let path = this.$route.query.redirect
            this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
          }
        })
        .catch(failResponse => {
          console.log('aaa')
        })
    }
  }
}
</script>

<style>
  .login-title{
    margin-bottom: 30px;
  }
  .login-form{
    width: 400px;
    margin: 100px auto;
    border-radius: 10%;
  }
  #poster {
    background: url("../assets/background.jpg") no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
    position: fixed;
  }
  body{
    margin: 0px;
  }
  .login-btn{
    width: 100%;background: #505458;border: none
  }
</style>
