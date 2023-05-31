<template>
    <div class="common-layout">
        <el-container>
            <!-- 头部 -->
            <el-header>
                <el-row :gutter="20" align="middle">
                    <el-col :span="5" :offset="5">
                        <!-- 输入框 -->
                        <el-input v-model="input4" class="w-50 m-2" placeholder="搜索动态">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <search />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="8" :offset="2">
                        <!-- 导航栏 -->
                        <el-menu text-color="#fff" active-text-color="skyblue" background-color="#545c64"
                            class="el-menu-demo" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="1">首页</el-menu-item>
                            <el-menu-item index="2">搜索好友</el-menu-item>
                            <el-menu-item index="7">欢迎您<span
                                    :style="[{ color: 'yellow', marginLeft: '10px', fontWeight: 'bold' }]">{{
                                        $store.state.userinfo?.susername
                                    }}</span></el-menu-item>
                            <el-sub-menu index="6">
                                <template #title>

                                    <el-avatar :size="35" :src="circleUrl" />

                                </template>
                                <el-menu-item index="6-1">个人中心</el-menu-item>
                                <el-menu-item index="6-2">设置</el-menu-item>
                                <el-menu-item index="6-3">退出</el-menu-item>
                            </el-sub-menu>

                            <el-menu-item index="4">
                                <el-icon>
                                    <ChatLineRound />
                                </el-icon>
                                <span>聊天</span>
                            </el-menu-item>
                            <el-menu-item index="5">
                                <el-icon>
                                    <Message />
                                </el-icon>
                                <span>通知</span>
                            </el-menu-item>
                        </el-menu>
                    </el-col>

                </el-row>
            </el-header>
            <RouterView></RouterView>
        </el-container>
    </div>
</template>

<script>
import { Search, User, ChatLineRound, Message, Avatar } from '@element-plus/icons-vue'
import { getAxiosUserinfo } from '@/server/usersign.js'
export default {
    components: {
        Search,
        User,
        ChatLineRound,
        Message,
        Avatar,
    },
    data() {
        return {
            input4: '',
            circleUrl: '',
        }
    },
    mounted() {
        // 获取用户信息
        getAxiosUserinfo({ sid: this.$store.state.userinfo.uid }).then(res => {
            // 更新头像
            this.circleUrl = res.data.data.info[0].savatar
            localStorage.setItem('ava', res.data.data.info[0].savatar)
        })
    },
    methods: {
        // 首页导航栏选中函数
        handleSelect(e) {
            console.log(e);
            switch (e) {
                case '1':
                    // 首页
                    this.$router.push('/school/index')
                    break;
                case '2':
                    // 搜索好友
                    this.$router.push('/school/socials')
                    break;

                case '4':
                    // 聊天
                    this.$router.push('/chat/chats')
                    break;
                case '5':
                    // 通知
                    this.$router.push('/school/notice')
                    break;
                case '6-1':
                    // 个人中心
                    this.$router.push('/school/personal')
                    break;
                case '6-2':
                    // 设置
                    this.$router.push('/school/sets')
                    break;
                case '6-3':
                    // 退出
                    localStorage.setItem('token', '')
                    this.$store.commit('setUserInfoNull')
                    this.$router.push('/sign/login')
                    break;
                case '7':
                    this.$router.push('/school/personal')
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.common-layout,
.el-container {
    height: 100%;

    .el-header {
        background-color: #545c64;
        min-width: 1100px;

        .el-row {
            height: 100%;

            .el-col {
                .el-menu {
                    border: 0;
                }
            }
        }
    }
}
</style>