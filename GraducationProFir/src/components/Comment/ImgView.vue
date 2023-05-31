<template>
    <img :src="avatar">
</template>

<script>
import { getAxiosUserinfo } from '@/server/usersign.js'
export default {
    props: ['id'],
    data() {
        return {
            avatar: '',//头像
        }
    },
    mounted() {
        getAxiosUserinfo({ sid: this.id }).then(res => {
            this.avatar = res.data.data.info[0].savatar
        })
    }
}
</script>

<style lang="scss" scoped></style>