<template>
    <el-container>
        <el-aside width="250px">
            <el-row justify="space-between" class="aside-h">
                <el-col :span="12">
                    <el-avatar :size="50" :src="circleUrl" />
                    <span style="font-size: 13px;margin-left: 3px;">{{ this.$store.state.userinfo?.susername }}</span>
                </el-col>
                <el-col :span="4" style="justify-self: right;">
                    <span></span>
                    <span @click="$router.go(-1)" style="cursor: pointer;">退出</span>
                </el-col>
            </el-row>
            <el-row class="search">
                <el-col>
                    <el-input v-model.trim="input4" class="w-50 m-2" placeholder="查找联系人" @input="search">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <div class="friendchat">

                <el-scrollbar>
                    <ul>
                        <li v-for="item, index in copyfriendslist" :key="index" @click="routeClk(item)">
                            <UserAvatar :id="item.userid"></UserAvatar>

                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </el-aside>
        <el-container class="msg">
            <div class="msg-box1" v-if="flag === 0">
                您还没有选择聊天，快去和好友聊一聊吧！
            </div>
            <ChatBox v-if="flag === 1" @initchatlist="initchatList" :msglists="msglist" @sendmsg="sendMsg" :data="data">
            </ChatBox>
        </el-container>
    </el-container>
</template>

<script>
import UserAvatar from '@/components/UserAvatar.vue'
import { Search, } from '@element-plus/icons-vue'
import { userfriendsList } from '@/server/usersign.js'
import io from 'socket.io-client'
import ChatBox from '@/components/ChatBox.vue'
export default {
    data() {
        return {
            circleUrl: '',
            input4: '',
            // 好友列表
            friendslist: [],
            copyfriendslist: [],
            // 内容切换
            flag: 0,
            // 通信对象
            socket: '',
            // 传值子组件的数据
            data: {},
            // 传给子组件的聊天数据
            msglist: [],
        }
    },
    mounted() {
        this.circleUrl = localStorage.getItem('ava')
        // 获取好友列表
        userfriendsList({ id: this.$store.state?.userinfo?.uid }).then(res => {
            if (res.data.code === 201) {
                // 1，获取朋友id列表
                let useridlist = res.data?.data[0]?.userid?.split(';').slice(0, -1).map(item => +item)
                // 2，获取朋友姓名列表
                let fnamelist = res.data?.data[0]?.friendsname?.split(';').slice(0, -1)
                // 3，获取朋友头像列表 暂无
                // 4，合成一个新数组
                let newarr = []
                for (let i = 0; i < useridlist.length; i++) {
                    newarr.push({ userid: useridlist[i], friendsname: fnamelist[i], friendsavatar: '' })
                }

                this.friendslist = newarr
                this.copyfriendslist = newarr
                console.log(newarr);
            }
        })
        // 创建聊天连接
        // this.socket = io.connect(import.meta.env.VITE_url + '/home', { 'force new connection': true })//连接后端的socket.io方法里面传服务端的IP
        this.socket = io.connect('http://localhost:3000', { 'force new connection': true })//连接后端的socket.io方法里面传服务端的IP

        this.socket.emit('login', this.$store.state.userinfo?.uid)//标识上线
        // 获取接收回来的消息列表
        this.socket.on('fresh-message', (data) => {
            this.msglist.push(data)

        })
    },

    components: {
        Search,
        ChatBox,
        UserAvatar,
    },
    computed: {
        Plus() {
            return Plus
        }
    },
    methods: {
        // 初始化聊天数据
        initchatList(data) {

            let arr = data[0]?.messages?.split(';').filter(item => item).map(item => {
                return JSON.parse(item)
            })
            this.msglist = arr
        },
        // 聊天朋友切换
        routeClk(item) {
            this.flag = 1
            this.data = item
        },
        // 表情切换
        emoClick(e) {
            if (e.target.nodeName !== 'SPAN') return
            this.input = this.input.concat(e.target.innerHTML)
        },
        // 发送聊天消息
        sendMsg(data) {
            this.socket.emit('sendMsg', data)
        },
        // 搜索好友
        search() {
            console.log(this.input4);
            console.log(this.friendslist);
            this.copyfriendslist = this.friendslist.filter(item => {
                return item.friendsname.includes(this.input4)
            })
        },

    }
}
</script>

<style lang="scss" scoped>
.el-container {

    background-color: rgb(248, 248, 248);
    height: 100%;
    overflow: auto;
    padding: 0 200px;

    .el-aside {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: #545c64;
        color: white;
        overflow: hidden;

        .el-row {
            margin: 10px 0;
        }

        .aside-h {
            align-items: center;

            .el-col {
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
        }

        .friendchat {
            flex: 1;
            overflow: visible;



            .el-scrollbar {
                height: 600px;

                ul {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    margin-bottom: 20px;

                    li {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        border-bottom: 1px solid rgb(66, 66, 66);
                        cursor: pointer;

                    }
                }

            }
        }
    }

    .msg {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0 20px;
        min-width: 800px;
        overflow: visible;
        background-color: #dedfe0;

        .msg-box1 {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
        }

        // 输入框
    }
}
</style>