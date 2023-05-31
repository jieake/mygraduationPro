<template>
  <el-form label-position="left" ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" status-icon>
    <h2>注册账号</h2>
    <p>已经拥有账号？<RouterLink to="/sign/login">去登录</RouterLink>
    </p>
    <el-form-item label="昵称" prop="unick">
      <el-input v-model="ruleForm.unick" placeholder="给自己起一个好听的昵称" />
    </el-form-item>
    <el-form-item label="密码" prop="upassword">
      <el-input type="password" show-password v-model="ruleForm.upassword" placeholder="6-15位的字母/数字/下划线" />
    </el-form-item>
    <el-form-item label="邮箱" prop="uemail">
      <el-input type="email" v-model="ruleForm.uemail" placeholder="可用邮箱" />
    </el-form-item>
    <el-form-item label="学校" prop="uschool">
      <el-input v-model="ruleForm.uschool" placeholder="学校全称" />
    </el-form-item>
    <div class="btns">
      <el-button type="primary" @click="submitForm($refs.ruleFormRef)">注册</el-button>
      <el-button type="danger" @click="resetForm($refs.ruleFormRef)">重置</el-button>
    </div>
  </el-form>
</template>


<script>
import { userSign } from "@/server/usersign";
export default {
  methods: {
    // 重置表单
    resetForm(formEl) {
      if (!formEl) return
      formEl.resetFields()
    },
    // 提交表单
    submitForm(formEl) {
      if (!formEl) return
      formEl.validate((valid) => {
        // valid为true时表示验证成功
        if (valid) {
          // 验证成功
          let formObj = {
            susername: this.ruleForm.unick,
            spassword: this.ruleForm.upassword,
            semail: this.ruleForm.uemail,
            school: this.ruleForm.uschool
          }
          userSign(formObj).then(res => {
            if (res.data.code === 200) {
              this.$router.push('/sign/login')
            }
          })
        } else {
          // 验证失败
          return false
        }
      })
    }
  },
  data() {
    return {
      // 表单数据
      ruleForm: {

        uemail: '',
        unick: '',
        upassword: '',
        uschool: '',
      },
      // 表单校验规则
      rules: {
        uemail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
        unick: [
          { required: true, message: '请输入您的昵称', trigger: 'blur' },
          { pattern: /^[\u2E80-\u9FFF]{1,8}$/, message: '请输入1-8个汉字', trigger: 'blur' },
        ],
        upassword: [
          { required: true, message: '请输入您的账户密码', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{6,15}$/, message: '6-15位的字母/数字/下划线', trigger: 'blur' },
        ],
        uschool: [
          { required: true, message: '请输入学校名称', trigger: 'blur' },
          { pattern: /^[\u2E80-\u9FFF]{2,25}$/, message: '长度2-25之间', trigger: 'blur' },
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