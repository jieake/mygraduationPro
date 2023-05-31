<template>
    <div>
        <el-form :label-position="labelPosition" :rules="rules" ref="ruleFormRef" label-width="100px"
            :model="formLabelAlign" style="max-width: 460px">
            <el-form-item label="性别">
                <el-radio-group v-model="formLabelAlign.radio">
                    <el-radio :label="1">女</el-radio>
                    <el-radio :label="2">男</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="电话号码" prop="uphone">
                <el-input v-model="formLabelAlign.uphone" placeholder="输入你的电话号码" />
            </el-form-item>
            <el-form-item label="学号" prop="snumber">
                <el-input v-model="formLabelAlign.snumber" placeholder="输入你的学号" />
            </el-form-item>
            <el-form-item label="真实姓名" prop="sname">
                <el-input v-model="formLabelAlign.sname" placeholder="输入你的姓名" />
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
                uphone: '',//电话号码
                snumber: '',//学号
                sname: '',//真实姓名
                value3: false,// switch开关数据
                radio: 2,//性别 1女 2男
            },
            // 文本label位置
            labelPosition: 'left',

            // 验证规则
            rules: {
                uphone: [
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                    { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '电话号码格式不正确', trigger: 'blur' },
                ],
                sname: [
                    { required: true, message: '请输入真名', trigger: 'blur' },
                    { pattern: /^[\u2E80-\u9FFF]{1,8}$/, message: '姓名为1-8个汉字', trigger: 'blur' },
                ],
                snumber: [
                    { required: true, message: '请输入您的学号', trigger: 'blur' },
                    { pattern: /^[0-9]{4,20}$/, message: '4-20位的数字', trigger: 'blur' },
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
                        sgender: this.formLabelAlign.radio === 2 ? 1 : 0,
                        sphone: this.formLabelAlign.uphone,
                        studentnum: this.formLabelAlign.snumber,
                        struename: this.formLabelAlign.sname,
                        sflag: 2,
                    }

                    setAxiosUserinfo(formObj).then(res => {
                        // 修改成功后重置
                        this.formLabelAlign.uphone = ''
                        this.formLabelAlign.snumber = ''
                        this.formLabelAlign.sname = ''
                        this.formLabelAlign.radio = 2
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