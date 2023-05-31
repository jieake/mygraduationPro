<template>
    <el-avatar :size="50" :src="friendsavatar" />
    <div class="right">
        <div class="name">{{ fname }}</div>
        <div class="aside-msg">签名：{{ ftag || '这个人很懒，什么都没写' }}</div>
    </div>
</template>

<script>
import { getAxiosUserinfo } from '@/server/usersign.js'
export default {
    props: ['id'],
    data() {
        return {
            friendsavatar: '',//头像
            fname: '',//姓名
            ftag: '',//签名
        }
    },
    mounted() {
        console.log(this.id);
        getAxiosUserinfo({ sid: this.id }).then(res => {
            console.log(res);
            this.friendsavatar = res.data.data.info[0].savatar
            this.fname = res.data.data.info[0].susername
            this.ftag = res.data.data.info[0].sintroduction
        })
    },
}
</script>

<style lang="scss" scoped>
.right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 170px;

    .aside-msg {
        overflow: hidden;
        text-overflow: ellipsis;

        white-space: nowrap
    }
}
</style>