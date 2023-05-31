<template>
    <div>
        通告管理：
        <ul v-if="msgList.length">
            <li v-for="item, index in msgList">{{ item }}</li>
        </ul>

        <div>
            <el-input v-model="textarea" :rows="4" type="textarea" placeholder="输入通告..." />
        </div>
        <el-button type="primary" plain @click="clk">提交</el-button>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            textarea: '',
            msgList: [],//通告
        }
    },
    methods: {
        clk() {
            this.textarea = ''
            ElMessage({
                message: '发布成功！',
                type: 'success',
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>