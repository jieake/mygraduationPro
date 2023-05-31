<template>
    <el-scrollbar>
        <div class="notice">
            <li>
                <span style="margin-right: 20px;">测试</span>
                <span>管理员</span>
            </li>
            <ul>
                <li>
                    <span>通知</span>
                    <span><a href="#">通知设置</a></span>
                </li>
                <template v-for="item in msglist" :key="item.index">


                    <li v-if="item.senduserid === this.$store.state.userinfo.uid && item.requestflag === 0">
                        好友请求被拒
                    </li>
                    <li v-else-if="item.getuserid === this.$store.state.userinfo.uid && item.requestflag === -1">
                        {{ item.sendusername + '请求添加为好友' }}
                    </li>
                </template>
            </ul>
        </div>
    </el-scrollbar>
</template>

<script>
import { getrequiremsg } from '@/server/usersign.js'
export default {
    data() {
        return {
            msglist: [],//请求消息列表
        }
    },
    mounted() {
        // 获取请求消息列表
        getrequiremsg({ id: this.$store.state.userinfo.uid }).then(res => {
            if (res.data.code === 201) {
                this.msglist = res.data.data
                console.log(this.msglist);
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.notice {
    height: 100%;
    margin: 0 300px;
    padding-top: 20px;
    font-size: 14px;
    overflow: auto;
    min-width: 600px;
}

.notice>ul>li {
    display: flex;
    align-items: center;

    height: 70px;
    border-bottom: 3px solid rgb(224, 224, 224);
}

.notice>ul>li:nth-child(1) a {
    color: rgb(6, 198, 198);
    text-decoration: none;
}

.notice>ul>li:nth-child(1) {
    justify-content: space-between;
    font-size: 16px;
}

.notice>ul>li:not(li:nth-child(1))>img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0 20px 0 0;
}

.notice>ul>li:not(li:nth-child(1))>div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50px;
}
</style>