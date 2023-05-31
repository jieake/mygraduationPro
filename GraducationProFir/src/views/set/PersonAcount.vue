<template>
    <div>
        <el-form :label-position="labelPosition" :rules="rules" ref="ruleFormRef" :model="formLabelAlign"
            style="max-width: 460px">
            <el-form-item label="昵称" prop="unick">
                <el-input v-model="formLabelAlign.unick" />
            </el-form-item>
            <el-form-item label="密码" prop="upassword">
                <el-input v-model="formLabelAlign.upassword" />
            </el-form-item>
            <el-form-item label="邮箱" prop="uemail">
                <el-input type="email" v-model="formLabelAlign.uemail" placeholder="输入账号邮箱确认身份" />
            </el-form-item>
            <el-form-item label="是否确认修改">
                <el-switch v-model="formLabelAlign.value3" inline-prompt active-text="是" inactive-text="否" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm($refs.ruleFormRef)">提交</el-button>
                <el-button type="danger" @click="resetForm($refs.ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { setAxiosUserinfo } from '@/server/usersign.js'
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            // 表单数据
            formLabelAlign: {
                unick: '',
                upassword: '',
                uemail: '',
                value3: false,// switch开关数据
            },
            // 文本label位置
            labelPosition: 'left',

            // 验证规则
            rules: {
                unick: [
                    { required: true, message: '请输入您的昵称', trigger: 'blur' },
                    { pattern: /^[\u2E80-\u9FFF]{1,8}$/, message: '请输入1-8个汉字', trigger: 'blur' },
                ],
                upassword: [
                    { required: true, message: '请输入您的账户密码', trigger: 'blur' },
                    { pattern: /^[a-zA-Z0-9_]{6,15}$/, message: '6-15位的字母/数字/下划线', trigger: 'blur' },
                ],
                uemail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
                ],

            }
        }
    },
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
                    // 开关
                    if (!this.formLabelAlign.value3) {
                        ElMessage({
                            message: '请确认修改！',
                            type: 'warning',
                        })
                        return
                    }
                    // 验证成功
                    let formObj = {
                        sid: this.$store.state.userinfo.uid,
                        susername: this.formLabelAlign.unick,
                        spassword: this.formLabelAlign.upassword,
                        semail: this.formLabelAlign.uemail,
                        sflag: 1,
                    }

                    setAxiosUserinfo(formObj).then(res => {
                        // 修改成功后重置
                        this.formLabelAlign.uemail = ''
                        this.formLabelAlign.unick = ''
                        this.formLabelAlign.upassword = ''
                        this.formLabelAlign.value3 = false
                    })
                } else {
                    // 验证失败
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>