<template>
  <el-form label-position="left" ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon>
    <h2>登录</h2>
    <p>还没有账号？<RouterLink to="/sign/regist">立即注册</RouterLink>
    </p>
    <el-form-item label="昵称" prop="unick">
      <el-input type="text" v-model="ruleForm.unick" placeholder="昵称/1-8个字符" />
    </el-form-item>
    <el-form-item label="密码" prop="upassword">
      <el-input type="password" show-password v-model="ruleForm.upassword" placeholder="6-15位字母/数字/下划线" />
    </el-form-item>
    <el-form-item label="验证码" prop="ucodes">
      <el-input style="width: 200px;" v-model.number="ruleForm.code" placeholder="输入右侧验证码/点击切换" />
      <el-tag class="ml-2" @click="getCodes" style="cursor: pointer;">{{ codes }}</el-tag>
    </el-form-item>
    <div class="btns">
      <el-button type="primary" @click="submitForm($refs.ruleFormRef)">登录</el-button>
    </div>
  </el-form>
</template>


<script>
import { getCheckCode, userlogin } from "@/server/usersign";
export default {
  mounted() {
    // 调用函数获取验证码
    this.getCodes()
  },
  methods: {
    // 获取验证码
    getCodes() {
      // 获取验证码
      getCheckCode().then(res => {
        if (res.data.code === 201) {
          this.codes = res.data.data
          // 验证码存储到本地
          localStorage.setItem('code', res.data.data)
        }
      })
    },

    // 提交表单
    submitForm(formEl) {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          // 提交成功
          userlogin({ susername: this.ruleForm.unick, spassword: this.ruleForm.upassword }).then(res => {
            if (res.data.code === 200) {
              localStorage.setItem('token', res.data?.token)
              this.$store.commit('setUserInfo', res.data?.data)
              this.$router.push('/school/index')
            }
          })
        } else {
          // 提交失败
          return false
        }
      })
    },
    // 校验验证码
    validateCode(rule, value, callback) {
      if (this.ruleForm.code !== this.codes) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
  },
  data() {
    return {
      // 验证码
      codes: '',
      // 表单数据
      ruleForm: {
        // 用户昵称
        unick: '',
        // 用户密码
        upassword: '',
        // 验证码
        code: '',
      },
      rules: {
        unick: [
          { required: true, message: '请输入您的昵称', trigger: 'blur' },
          { pattern: /^[\u2E80-\u9FFF]{1,8}$/, message: '请输入1-8个汉字', trigger: 'blur' },
        ],
        upassword: [
          { required: true, message: '请输入您的账户密码', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{6,15}$/, message: '6-15位的字母/数字/下划线', trigger: 'blur' },
        ],
        ucodes: [
          { validator: this.validateCode, trigger: 'blur' },
        ],

      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  border: 1px solid gray;
  padding: 20px;
  background-color: rgba($color: #fff, $alpha: .8);

  .btns {
    text-align: center;
  }

  .el-form-item {

    .el-input {
      width: 300px;
    }
  }

  h2 {
    text-align: center;
    margin: 20px 0;
    opacity: .8;
  }

  p {
    @extend h2
  }
}
</style>