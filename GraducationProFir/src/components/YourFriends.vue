<template>
    <el-row justify="space-between">
        <el-col :span="5">
            <el-avatar :size="35" :src="favatar" />
        </el-col>
        <el-col :span="8" style="line-height: 38px;">
            <el-text truncated>{{ data.uname }}</el-text>
        </el-col>
    </el-row>
</template>

<script>
import { getAxiosUserinfo } from '@/server/usersign.js'
export default {
    props: ['data'],
    data() {
        return {
            favatar: '',//朋友头像
        }
    },
    mounted() {
        getAxiosUserinfo({ sid: this.data.id }).then(res => {
            this.favatar = res.data.data.info[0].savatar
        })
    }
}
</script>

<style lang="scss" scoped></style>