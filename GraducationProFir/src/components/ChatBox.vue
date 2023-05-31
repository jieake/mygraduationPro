<template>
    <div class="msg">
        <el-header>
            <el-row>
                <el-col>
                    <span>{{ fname }}</span>
                </el-col>
            </el-row>
        </el-header>
        <el-scrollbar>
            <el-main>
                <template v-for="item, index in msglists" :key="index">

                    <div v-if="item?.fromUid === fid" class="msg-contain left">
                        <el-avatar :size="30" :src="fcircleUrl" />
                        <div class="msg-contain-txt">
                            <p>{{ fname }}</p>
                            <div class="bubble">
                                {{ item.msg }}
                            </div>
                        </div>
                    </div>
                    <div v-else class="msg-contain right">
                        <el-avatar :size="30" :src="ucircleUrl" />
                        <div class="msg-contain-txt">
                            <p>{{ this.$store.state?.userinfo?.susername }}</p>
                            <div class="bubble">
                                {{ item.msg }}
                            </div>
                        </div>
                    </div>
                </template>
            </el-main>
        </el-scrollbar>
        <el-footer>
            <el-row :gutter="10">
                <el-col :span="12" :offset="3">
                    <el-input v-model="input" placeholder="说点什么...">
                        <template #suffix>

                            <el-popover :visible="visible" placement="top" :width="160">
                                <!-- 表情列表 -->
                                <div @click="emoClick($event)">
                                    <span v-for="item, index in emojilist" :key="index" style="cursor: pointer;margin: 5px;"
                                        v-html="item"></span>
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
                    <el-button type="primary" @click="sendmsgclk">发送</el-button>
                </el-col>
            </el-row>
        </el-footer>
    </div>
</template>

<script>
import { getchatmsg, getAxiosUserinfo } from '@/server/usersign.js'
export default {
    props: ['data', 'msglists'],
    data() {
        return {
            // 朋友昵称
            fname: '',
            // 朋友id
            fid: -1,
            // 朋友头像
            fcircleUrl: '',
            // 用户头像
            ucircleUrl: localStorage.getItem('ava'),
            // 输入内容
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
            // 用户发送的消息
            // userchatList: [],
        }
    },
    mounted() {
        let { userid, friendsname, friendsavatar } = this.data
        this.fname = friendsname
        this.fid = userid
        this.circleUrl = friendsavatar
        // 初始化聊天数据
        getchatmsg({ idone: this.fid, idtwo: this.$store.state?.userinfo?.uid }).then(res => {
            if (res.data.code === 201) {
                console.log(res.data.data);
                // 传值给父组件
                this.$emit('initchatlist', res.data.data)
            }
        })
        // 获取朋友信息
        getAxiosUserinfo({ sid: this.data.userid }).then(res => {
            this.fcircleUrl = res.data.data.info[0].savatar
        })
    },

    methods: {
        // 表情切换
        emoClick(e) {
            if (e.target.nodeName !== 'SPAN') return
            this.input = this.input.concat(e.target.innerHTML)
        },
        // 消息发送
        sendmsgclk() {
            this.$emit('sendmsg', { sendId: this.$store?.state?.userinfo?.uid, receiverId: this.fid, msg: this.input })
            // -1表示用户自己发送的消息
            // this.userchatList.push({ fromUid: -1, msg: this.input })
            this.input = ''
        }
    }
}
</script>

<style lang="scss" scoped>
.el-header {
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(66, 66, 66);
    padding: 0;

    span {
        color: gray;
    }
}

.el-main {
    flex: 1;
    padding: 20px 0;
    overflow: auto;

    .msg-contain.left {
        display: flex;
        margin: 20px 0;

        .msg-contain-txt {
            margin-top: -5px;

            p {
                font-size: 12px;
                text-align: left;
                margin-left: 17px;
                margin-bottom: 3px;
            }

            .bubble {
                max-width: 400px;
                border-radius: 10px;
                background-color: white;
                padding: 10px;
                position: relative;
                margin-left: 17px;
            }

            .bubble::before {
                position: absolute;
                top: 10px;
                left: -18px;
                content: '';
                width: 0;
                height: 0;
                border-right: 10px solid #fff;
                border-bottom: 10px solid transparent;
                border-left: 10px solid transparent;
                // border-top: 10px solid transparent;
            }
        }
    }

    .msg-contain.right {
        display: flex;
        flex-direction: row-reverse;
        margin: 20px 0;

        .msg-contain-txt {
            margin-top: -5px;

            p {
                font-size: 12px;
                text-align: right;
                margin-right: 18px;
                margin-bottom: 3px;
            }

            .bubble {
                position: relative;
                max-width: 400px;
                border-radius: 10px;
                background-color: white;
                padding: 10px;
                margin-right: 17px;
            }

            .bubble::after {
                position: absolute;
                right: 2px;
                content: '';
                margin-right: -20px;
                width: 0;
                height: 0;
                border-right: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 10px solid #fff;
                // border-top: 10px solid transparent;
            }
        }
    }
}

.el-footer {
    height: 65px;
}
</style>