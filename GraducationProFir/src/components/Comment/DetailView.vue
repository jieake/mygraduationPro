<template>
    <el-container>
        <el-aside width="350px" class="hidden-md-and-down">

        </el-aside>
        <el-main>
            <el-row justify="space-between" class="detail-head">
                <el-col :span="3">
                    <el-icon :size="20" style="cursor: pointer;" @click="$router.go(-1)">
                        <ArrowLeft />
                    </el-icon>
                </el-col>
                <el-col :span="12" style="text-align: center;">{{ stfresh.sfreshauthor }}的动态</el-col>
                <el-col :span="3"></el-col>
            </el-row>
            <el-scrollbar>
                <div class="avtiveMsg">
                    <!-- 动态列表 -->
                    <el-row>
                        <el-col>
                            <el-card shadow="hover" class="box-card">
                                <template #header>
                                    <div class="card-header">
                                        <div class="block">
                                            <el-avatar :size="35" :src="circleUrl" />
                                            <div class="ava-msg">
                                                <span class="top">{{ stfresh.sfreshauthor }}</span>
                                                <span class="bot">{{ new Date(stfresh.sfreshtime).toLocaleString() }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div class="text item">
                                    <div class="text-msg">
                                        {{ stfresh.sfreshcontent }}
                                    </div>
                                    <div class="imgs">
                                        <ul>
                                            <li v-for="item, index in freshimg" :key="index">
                                                <el-image style="width: 120px; height: 120px" :src="item" :fit="fit" />
                                            </li>

                                        </ul>
                                    </div>

                                </div>
                            </el-card>


                        </el-col>
                    </el-row>

                    <!-- 动态评论区和点赞区 -->
                    <el-tabs type="border-card">
                        <el-tab-pane>
                            <template #label>
                                <span class="custom-tabs-label">
                                    <span>评论</span><span>{{ stfresh.scommendnum }}</span>
                                </span>
                            </template>
                            <div class="tabs-comment" v-for="item, index in freshcomment" :key="index">
                                <ImgView :id="item.commentaid"></ImgView>
                                <div class="right">
                                    <p><span style="color: rgb(142, 5, 5);">{{ item.commentauthor }}</span>：{{
                                        item.commentmsg }}</p>
                                    <p style="font-size: 13px;margin-top: 5px;">{{ new
                                        Date(item.commenttime).toLocaleString() }}</p>
                                </div>
                            </div>

                        </el-tab-pane>
                        <el-tab-pane>
                            <template #label>
                                <span class="custom-tabs-label">
                                    <span>收藏</span><span>{{ stfresh.sfreshCollect }}</span>
                                </span>
                            </template>
                            <p v-for="item in starlist" :key="item.index"> <span style="color: rgb(140, 14, 14);">{{
                                item.freshstarname }}</span> 收藏了该动态</p>
                        </el-tab-pane>

                    </el-tabs>
                </div>
            </el-scrollbar>
            <!-- 发布评论 -->
            <el-footer>
                <el-row :gutter="10">
                    <el-col :span="12" :offset="3">
                        <el-input v-model.lazy.trim="input" placeholder="说点什么">
                            <template #suffix>

                                <el-popover :visible="visible" placement="top" :width="160">
                                    <!-- 表情列表 -->
                                    <div @click="emoClick($event)">
                                        <span v-for="item, index in emojilist" :key="index"
                                            style="cursor: pointer;margin: 5px;" v-html="item"></span>
                                    </div>

                                    <div style="text-align: right; margin: 0">
                                        <el-button size="small" text @click="visible = false">取消</el-button>
                                    </div>
                                    <template #reference>
                                        <!-- 表情包 -->
                                        <span style="cursor: pointer;" @click="visible = true">&#128578;</span>
                                    </template>
                                </el-popover>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="sendComment">发送</el-button>
                    </el-col>
                </el-row>
            </el-footer>
        </el-main>
        <el-aside width="350px" class="hidden-md-and-down">

        </el-aside>
    </el-container>
</template>

<script>
import { getsomeactive, sendAxiosComment, getAxioComments, updateAxiosFresh, getAxiosStar } from '@/server/usersign.js'
import { Plus, ArrowLeft, } from '@element-plus/icons-vue'
import ImgView from '@/components/Comment/ImgView.vue'
export default {
    data() {
        return {
            fit: 'fill',//图片内容大小适应
            circleUrl: '',
            input: '',
            visible: false,
            emojilist: [
                '&#128512;',
                '&#128513;',
                '&#128514;',
                '&#128515;',
                '&#128516;',
                '&#128517;',
                '&#128518;',
                '&#128519;',
                '&#128523;',
                '&#128525;',
                '&#128531;',
                '&#128533;',
            ],
            stfresh: {},//动态对象数据
            freshimg: [],//动态图片
            freshcomment: [],//评论数据
            starlist: [],//收藏者数据
        }
    },
    methods: {
        emoClick(e) {
            if (e.target.nodeName !== 'SPAN') return
            this.input = this.input.concat(e.target.innerHTML)
        },
        // 获取动态评论数据和收藏者数据
        getSomeComments() {
            getAxioComments({ stfreshid: this.$route.query.acId })
                .then(res => {
                    if (res.data.code === 201) {
                        console.log(res);
                        this.freshcomment = res.data.data
                    }
                })

        },
        // 发送评论
        sendComment() {
            // 不能为空
            if (!this.input) {
                return
            }
            let obj = {
                stfreshid: this.$route.query.acId,
                commentauthor: this.$store.state.userinfo.susername,
                commentaid: this.$store.state.userinfo.uid,
                commentmsg: this.input,
            }
            // 发送评论
            sendAxiosComment(obj).then(res => {
                if (res.data.code === 201) {
                    this.getSomeComments()
                }
            })
            // 添加评论数量 0是收藏，1是评论
            updateAxiosFresh({ tag: 1, stfreshid: this.$route.query.acId }).then(res => {
                if (res.data.code === 201) {
                    getsomeactive({ stfreshid: this.$route.query.acId }).then(res => {
                        this.stfresh = res.data.data[0]
                        this.freshimg = JSON.parse(res.data.data[0].sfreshimglist)
                    })
                }
            })
            this.input = ''
        },
    },
    components: {
        ArrowLeft,
        ImgView,
    },
    computed: {
        Plus() {
            return Plus
        }
    },
    mounted() {
        let stfreshid = this.$route.query.acId
        // 请求该动态数据
        getsomeactive({ stfreshid }).then(res => {
            this.stfresh = res.data.data[0]
            this.circleUrl = res.data.data[0].savatar
            this.freshimg = JSON.parse(res.data.data[0].sfreshimglist)
        })
        // 请求该动态数据的评论
        this.getSomeComments()
        // 获取收藏者数据
        getAxiosStar({ stfreshid: this.$route.query.acId }).then(res => {
            let arr = res.data.data
            // 利用对象进行去重
            let obj = {}
            arr.forEach(item => {
                obj[item.stfreshid] = item
            })

            this.starlist = Object.values(obj)

        })

    }
}
</script>

<style lang="scss" scoped>
.el-container {
    background-color: rgb(248, 248, 248);
    height: 100%;
    overflow: auto;

    .el-aside {
        padding: 20px;
    }

    .el-footer {
        display: flex;
        flex-direction: column;
        justify-content: center;

        border-top: 1px solid rgb(226, 226, 226);
        background-color: #fff;
    }

    .el-main {
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 0;

        .avtiveMsg {
            flex: 1;
            overflow: auto;

            .el-row {
                background-color: #fff;

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

            .el-tabs {
                margin-top: 20px;

                .tabs-comment {
                    margin: 5px 0;
                    display: flex;

                    img {
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                    }

                    .right {
                        flex: 1;
                    }
                }
            }
        }

        .detail-head {
            width: 100%;
            padding: 10px 20px;
            background-color: #fff;
        }


    }
}
</style>