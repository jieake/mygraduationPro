<template>
    <el-container>
        <el-aside width="350px" class="hidden-md-and-down">
            <el-row justify="end">
                <el-col :span="8">{{ $store.state?.userinfo?.school }}</el-col>
            </el-row>
            <el-row justify="end">
                <el-col :span="8">
                    <el-icon>
                        <HelpFilled />
                    </el-icon>
                    <span>动态资讯</span>
                </el-col>
            </el-row>
            <el-row justify="end">
                <el-col :span="8">
                    <el-icon>
                        <ChatDotSquare />
                    </el-icon>
                    <span>消息</span>
                </el-col>
            </el-row>
        </el-aside>
        <el-main>
            <el-row>
                <el-col>
                    <el-input placeholder="快来分享你的新鲜事吧！" @click="$router.push('/comment/publish')" />
                </el-col>
            </el-row>

            <!-- 动态列表 -->
            <el-row>
                <el-col>
                    <el-card v-for="item, index in activeList" :key="index" shadow="hover" class="box-card">
                        <template #header>
                            <div class="card-header">
                                <div class="block">
                                    <el-avatar :size="35" :src="item.savatar" />
                                    <div class="ava-msg">
                                        <span class="top">{{ item.sfreshauthor }}</span>
                                        <span class="bot">{{ new Date(item.sfreshtime).toLocaleString() }}</span>
                                    </div>
                                </div>
                                <!-- 添加好友 -->
                                <el-button class="button"
                                    v-if="item.flag === -2 && !friendstr.includes(item.sfreshauthorid) && item.sfreshauthorid !== this.$store.state.userinfo.uid"
                                    :icon="Plus" @click="madeFriends(index)">加好友</el-button>
                                <el-button class="button" v-else-if="item.flag === -1" disabled
                                    :icon="Check">等待同意</el-button>
                            </div>
                        </template>
                        <div class="text item" style="cursor: pointer;">
                            <div class=" text-msg" @click="$router.push('/comment/detail?acId=' + item.stfreshid)">
                                {{ item.sfreshcontent }}
                            </div>
                            <div class="imgs" @click="$router.push('/comment/detail?acId=' + item.stfreshid)">
                                <ul>
                                    <li v-for="imgs, index in JSON.parse(item?.sfreshimglist)" :key="index">
                                        <el-image style="width: 120px; height: 120px" :src="imgs" :fit="fit" />
                                    </li>
                                </ul>
                            </div>
                            <!-- 评论互动区域 -->
                            <div class="comment">
                                <el-row justify="space-between">
                                    <el-col :span="6">
                                        <el-badge :value="item.scommendnum" class="item" type="primary">
                                            <el-icon @click="$router.push('/comment/detail?acId=' + item.stfreshid)">
                                                <ChatRound />
                                            </el-icon>

                                        </el-badge>
                                        <el-badge :value="item.sfreshCollect" class="item" type="primary">
                                            <el-icon @click="addstar(item)">
                                                <Star />
                                            </el-icon>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="1">
                                        <el-icon>
                                            <MoreFilled />
                                        </el-icon>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-card>

                </el-col>
            </el-row>


        </el-main>
        <el-aside width="350px" class="hidden-md-and-down">
            <el-row>
                <el-col :span="8">
                    <el-icon>
                        <ChatDotSquare />
                    </el-icon>
                    <span>消息</span>
                </el-col>
            </el-row>
        </el-aside>
    </el-container>
</template>

<script>
import { HelpFilled, ChatDotSquare, Check, Plus, ChatRound, Star, MoreFilled, } from '@element-plus/icons-vue'
import { userGetActive, userHasFriends, sendrequirefriend, updateAxiosFresh, } from '@/server/usersign.js'
export default {
    data() {
        return {
            activeList: [], // 动态列表
            fit: 'fill',//图片内容大小适应
            circleUrl: '',//头像
            friendstr: '',//用户好友
        }
    },
    mounted() {
        // 获取网站用户动态
        userGetActive().then(res => {
            if (res.data.code === 201) {
                console.log(res.data.data);
                // 添加好友状态 flag: -2
                this.activeList = res.data.data?.map(item => ({ ...item, flag: -2 }))
            }
        })
        // 获取用户首页好友信息
        userHasFriends({ uid: this.$store.state?.userinfo?.uid }).then(res => {
            this.friendstr = res.data?.data[0] ? res.data?.data[0].userid : ''
        })
    },
    methods: {
        // 添加好友
        madeFriends(index) {
            this.activeList[index].flag = -1
            // this.activeList[index] = { ...this.activeList[index], flag: -1 }

            // 发送添加好友请求
            sendrequirefriend({ uname: this.$store.state.userinfo.susername, fromid: this.$store.state.userinfo?.uid, getid: this.activeList[index].sfreshauthorid })
                .then(res => {
                    if (res.data.code === 201) {
                        console.log('请求成功！');
                    } else if (res.data.code === 202) {
                        console.log('请求已经存在！');
                    }
                })
        },
        // 添加收藏
        addstar(item) {
            updateAxiosFresh({ tag: 0, stfreshid: item.stfreshid, freshstarid: this.$store.state.userinfo?.uid, freshstarname: this.$store.state.userinfo.susername }).then(res => {
                if (res.data.code === 201) {
                    // 获取网站用户动态
                    userGetActive().then(res => {
                        if (res.data.code === 201) {
                            // 添加好友状态 flag: -2
                            this.activeList = res.data.data?.map(item => ({ ...item, flag: -2 }))
                        }
                    })
                }
            })
        }
    },
    components: {
        HelpFilled,
        ChatDotSquare,
        ChatRound,
        Star,
        MoreFilled,

    },
    computed: {
        Plus() {
            return Plus
        },
        Check() {
            return Check
        }
    }
}
</script>

<style lang="scss" scoped>
.el-container {
    background-color: rgb(248, 248, 248);
    flex: 1;
    overflow: auto;

    .el-aside {
        padding: 20px;

        .el-row {
            margin: 20px 0;

            .el-col {
                display: flex;
                align-items: center;

                .el-icon {
                    color: blue;
                    margin-right: 10px;

                    .el-input {
                        border-radius: 20px;
                    }
                }
            }
        }
    }

    .el-main {
        padding: 20px 0;
        overflow: visible;

        .el-row {
            .el-col {
                .box-card {
                    margin: 10px 0;

                    .text {
                        margin-top: 10px;

                        .text-msg {
                            margin-bottom: 10px;
                        }

                        .imgs {
                            ul {
                                width: 385px;
                                display: flex;
                                flex-wrap: wrap;

                                li {
                                    padding: 0 8px 5px 0;

                                    img {
                                        display: block;
                                    }
                                }
                            }

                        }

                        .comment {
                            margin: 10px 0;

                            .el-badge {
                                margin: 0 15px 0 5px;

                                .el-icon {
                                    font-size: 23px;
                                }
                            }

                        }
                    }

                    .card-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .block {
                            display: flex;

                            .ava-msg {
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                margin-left: 10px;

                                .top {
                                    font-size: 19px;
                                }

                                .bot {
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>