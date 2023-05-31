<template>
    <el-card class="box-card" shadow="never">
        <template #header>
            <div class="card-header">
                <span>好友</span>
            </div>
        </template>
        <el-row>
            <!-- 好友列表 -->
            <el-col :span="6" v-for="item in friendList" :key="item.id" @click="$router.push('/chat/chats')">
                <YourFriends :data="item"></YourFriends>
            </el-col>

        </el-row>
    </el-card>
</template>

<script>
import YourFriends from '@/components/YourFriends.vue'
import { userfriendsList } from '@/server/usersign.js'
export default {
    data() {
        return {
            circleUrl: '',
            friendList: [],//好友列表
        }
    },
    mounted() {
        // 获取好友列表数据
        userfriendsList({ id: this.$store.state.userinfo.uid }).then(res => {
            if (res.data.code === 201) {
                let fnamearr = res.data.data[0].friendsname.split(';')
                let fuid = res.data.data[0].userid.split(';')
                for (let i = 0; i < fnamearr.length - 1; i++) {
                    let obj = {}
                    obj.id = fuid[i]
                    obj.uname = fnamearr[i]
                    this.friendList.push(obj)
                }
                console.log(this.friendList);
            }
        })
    },
    components: {
        YourFriends,
    }
}
</script>

<style lang="scss" scoped></style>