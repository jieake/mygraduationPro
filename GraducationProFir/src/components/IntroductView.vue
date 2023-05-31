<template>
    <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
            <el-card class="box-card" shadow="never" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>简介</span>
                    </div>
                </template>
                {{ introductions || '这个人很懒，什么都没写~' }}
            </el-card>
            <el-card class="box-card" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>照片</span>
                    </div>
                </template>
                默认
            </el-card>
        </el-aside>
        <!-- 主体 -->
        <el-main>
            <!-- 用户的动态列表 -->
            <el-row>
                <el-col>
                    <el-card shadow="never" class="box-card" v-for="item in freshinfo" :key="item.stfreshid"
                        @click="$router.push('/comment/detail?acId=' + item.stfreshid)" style="cursor: pointer;">
                        <template #header>
                            <div class="card-header">
                                <div class="block">
                                    <el-avatar :size="35" :src="circleUrl" />
                                    <div class="ava-msg">
                                        <span class="top">{{ item.sfreshauthor }}</span>
                                        <span class="bot">{{ new Date(item.sfreshtime).toLocaleString() }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="text item">
                            <div class="text-msg">
                                <el-row>
                                    <el-col :span="12">
                                        <el-text truncated>{{ item.sfreshcontent }}</el-text>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-card>


                </el-col>
            </el-row>

        </el-main>
    </el-container>
</template>

<script>
import { ChatRound, Star, MoreFilled, } from '@element-plus/icons-vue'
import { getAxiosUserinfo } from '@/server/usersign.js'
export default {
    data() {
        return {
            fit: 'fill',//图片内容大小适应
            circleUrl: '',
            introductions: '',//个人简介
            freshinfo: [],//个人动态
        }
    },
    components: {
        ChatRound, Star, MoreFilled,
    },
    mounted() {
        // 获取用户个人信息
        getAxiosUserinfo({ sid: this.$store.state.userinfo?.uid }).then(res => {
            this.introductions = res.data.data.info[0].sintroduction
            this.freshinfo = res.data.data.actives
        })
        this.circleUrl = localStorage.getItem('ava')
    }
}
</script>

<style lang="scss" scoped>
.el-container {
    .el-main {
        padding: 0 10px;

        .el-row {
            margin-bottom: 10px;
            max-height: 200px;
            overflow: hidden;

            .el-col {
                .box-card {

                    .text {
                        margin-top: 10px;
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