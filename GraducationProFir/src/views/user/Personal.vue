<template>
    <el-scrollbar>
        <div class="box">
            <div class="top">
                <!-- 存放背景图 -->
                <div class="banner">
                    <div class="top-avatar">
                        <img :src="uavatar">
                        <span>{{ $store.state.userinfo.susername }}</span>
                    </div>
                </div>
                <!-- 用户个人信息 -->
                <div class="uname">
                    <!-- 标签页 -->
                    <div class="tabs">
                        <ul>
                            <li :class="{ 'pointli': flag === 0 }" @click="clcTabs(0, 'Intro')">
                                <span>简介</span>
                            </li>
                            <li :class="{ 'pointli': flag === 1 }" @click="clcTabs(1, 'Friends')">
                                <span>
                                    好友
                                </span>
                            </li>
                            <li :class="{ 'pointli': flag === 2 }" @click="clcTabs(2, 'Images')">
                                <span>照片</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="bot">
                <KeepAlive>
                    <component :is="conname"></component>
                </KeepAlive>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import Intro from '@/components/IntroductView.vue'
import Friends from '@/components/FriendsList.vue'
import Images from '@/components/ImagesList.vue'
export default {
    components: {
        Intro,
        Friends,
        Images,
    },
    data() {
        return {
            // 动态组件名
            conname: 'Intro',
            // tabs栏切换
            flag: 0,
            uavatar: '',//用户头像
        }
    },
    methods: {
        handleClick() { },
        // tab栏切换
        clcTabs(n, str) {
            this.flag = n
            // 切换动态组件
            this.conname = str
        }
    },
    mounted() {
        this.uavatar = localStorage.getItem('ava')
    },
}
</script>

<style lang="scss" scoped>
.box {
    display: flex;
    flex-direction: column;
    margin: 20px 350px 0;
    min-width: 800px;
    overflow: auto;

    .top {
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        height: 250px;
        margin-bottom: 20px;

        .banner {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-left: 20px;
            height: 170px;
            background: no-repeat url('../../assets/images/registbak.jpg') center/cover;

            .top-avatar {
                position: relative;
                display: flex;
                align-items: center;
                height: 50px;

                span {
                    margin-left: 60px;
                    margin-top: 20px;
                }

                img {
                    position: absolute;
                    top: 50%;
                    height: 50px;
                    width: 50px;
                }
            }
        }

        .uname {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-left: 20px;
            background-color: #fff;

            .tabs {
                ul {
                    display: flex;

                    li {
                        cursor: pointer;
                        margin-right: 10px;

                        span {
                            display: block;
                            margin: 5px;
                        }

                        &:hover {
                            background-color: rgb(7, 220, 220);
                        }
                    }

                    li.pointli {
                        &::after {
                            content: '';
                            display: block;
                            border: 2px solid blue;
                            border-radius: 2px;
                        }
                    }
                }
            }
        }
    }

}
</style>