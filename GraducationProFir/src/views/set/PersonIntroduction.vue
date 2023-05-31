<template>
    <div>
        <el-input :rows="8" v-model.trim="textarea" maxlength="30" placeholder="写点什么来提升自己的格局..." show-word-limit
            type="textarea" />
        <div style="margin-top: 15px;">
            <el-button type="primary" @click="submitForm($refs.ruleFormRef)">提交</el-button>
        </div>
    </div>
</template>

<script>
import { setAxiosUserinfo } from '@/server/usersign.js'
export default {
    data() {
        return {
            textarea: ''
        }
    },
    methods: {
        submitForm() {
            if (!this.textarea) {
                return
            }
            // 验证成功
            let formObj = {
                sid: this.$store.state.userinfo.uid,
                sintroduction: this.textarea,
                sflag: 4,
            }

            setAxiosUserinfo(formObj).then(res => {
                // 修改成功后重置
                this.textarea = ''
            })
        }
    },
}
</script>

<style lang="scss" scoped></style>