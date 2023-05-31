<template>
    <el-table :data="userlist" style="width: 100%">
        <el-table-column prop="susername" label="姓名" width="180" />
        <el-table-column prop="spassword" label="密码" width="180" />
        <el-table-column prop="semail" label="邮箱" />
        <el-table-column prop="sgender" label="性别" />
        <el-table-column prop="sphone" label="电话" />
        <el-table-column prop="school" label="学校" />
    </el-table>
</template>

<script>
import { getAxiosAdminUserInfo } from '@/server/usersign.js'
export default {
    data() {
        return {
            userlist: [],
        }
    },
    mounted() {
        getAxiosAdminUserInfo().then(res => {
            this.userlist = res.data.data
        })
    },
}
</script>

<style lang="scss" scoped></style>