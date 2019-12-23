<template>
  <div class="loginbalck">
    <div class="boxlogin">
      <div class="login_head">
        <img src="../assets/logo.png"/>
      </div>
      <el-form :rules="Loginrules" ref="FormLoginrule" :model="LoginForm" label-width="0px" class="loginform">
     <!-- 用户名输入-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="LoginForm.username"></el-input>
        </el-form-item>
        <!-- 用户密码输入-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="LoginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <div class="buttonright">
        <el-button type="primary" @click="LgoinIndex">登入</el-button>
        <el-button type="info" @click="resetForm('FormLoginrule')">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      Loginrules: {
        username: [
          {
            required: true,
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    LgoinIndex () {
      this.$refs.FormLoginrule.validate(async valid => {
        if (valid === true) {
          var res = await this.$http.post('login', this.LoginForm)
          // console.log(res)
          if (res.data.meta.status === 200) {
            window.sessionStorage.setItem('Authorization', res.data.data.token)
            this.$router.push('/home')
            this.$message({
              message: '恭喜你，成功登入',
              type: 'success'
            })
          } else {
            this.$message.error('错了哦，请检查密码和用户名')
          }
        } else {
          this.$message.error('错了哦，请检查密码和用户名')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.loginbalck {
  background-color: #1d2124;
  height: 100%;
}
.boxlogin {
  width: 40vw;
  height: 48vh;
  background-color: #ffeeff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_head {
  height: 10vw;
  width: 10vw;
  border: 1px solid #ffffff;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px;
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 50%;
  }
}
.buttonright {
  display: flex;
  justify-content: flex-end;
}
.loginform {
  position: absolute;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  bottom: 15vh;
  width: 100%;
}
</style>
