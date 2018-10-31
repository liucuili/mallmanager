<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button @click = "handleLogin()" class="login-button" type="primary">主要按钮</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await this.$http.post('login', this.formData)
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 200) {
        const token = data.data.token
        sessionStorage.setItem('token', token)
        this.$router.push('/')
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    }
  }
  // methods: {
  //   handleLogin () {
  //     this.$http.post('login', this.formData)
  //       .then((res) => {
  //         const data = res.data
  //         const { meta: { status, msg } } = data
  //         // const {meta: {status,message}} = data
  //         if (status === 200) {
  //           console.log(data)
  //           const token = data.data.token
  //           sessionStorage.setItem('token', token)
  //           this.$message.success(msg)
  //         } else {
  //           this.$message.error(msg)
  //         }
  //       })
  //   }
  // }
}
</script>
<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-button {
  width: 100%;
}

</style>
