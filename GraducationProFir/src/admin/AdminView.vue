<template>
    <div class="box">
        <h2>后台管理系统</h2>
        <el-form ref="myform" class="loginform" :label-position="labelPosition" label-width="80px" :model="formLabelAlign"
            :rules="rules" style="max-width: 480px">
            <el-form-item label="用户名" prop="adminname">
                <el-input :prefix-icon="User" v-model="formLabelAlign.adminname" :validate-on-rule-change="false">
                </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input :prefix-icon="Lock" type="password" :show-password="true" v-model="formLabelAlign.password" />
            </el-form-item>
            <el-button @click="onSubmit" class="btn" type="primary">登录</el-button>
        </el-form>
    </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

export default {
    data() {
        return {
            rules: {
                adminname: [
                    { required: true, message: '请输入正确的用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度只能是3-5', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入正确的密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度必须是6-10', trigger: 'blur' },
                ],
            },

            formLabelAlign: {
                adminname: '',
                password: '',
            },
            labelPosition: 'left',
        }
    },
    computed: {
        User() {
            return User
        },
        Lock() {
            return Lock
        },
    },
    methods: {
        onSubmit() {
            if (this.formLabelAlign.adminname === 'admin' && this.formLabelAlign.password === '123456') {
                this.$router.push('/admin/index')
            } else {
                ElMessage({
                    message: '用户名和密码错误！',
                    type: 'warning',
                })
            }
        }
    }
}
</script>
  
  
<style lang="scss" scoped>
.box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: rgb(43, 60, 77);

    .loginform {
        padding: 50px;
        border: 1px solid gray;
        background-color: #fff;
        // position: absolute;
        // top: 50%;
        // left: 50%;
        // transform: translate(-50%, -50%);

        :deep(.btn) {
            margin-left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>
  