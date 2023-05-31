<template>
    <el-scrollbar>
        <div class="box">
            <el-card class="box-card" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>好友请求</span>
                    </div>
                </template>
                <div v-for="item, index in flist" :key="index" class="text item">
                    <span style="color: red;">
                        {{ item.sendusername }}</span> 请求添加为好友
                    <el-button type="primary" @click="agreefn(item)">同意</el-button>
                    <el-button type="danger" @click="refusefn(item)">拒绝</el-button>
                </div>
            </el-card>
            <!-- 搜索用户 -->
            <el-row class="search">
                <el-col>
                    <el-input v-model.trim="input4" class="w-50 m-2" placeholder="搜索用户" @input="search">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </el-col>
            </el-row>
            <el-card class="box-card" shadow="never" style="margin-top: 40px;">
                <template #header>
                    <div class="card-header">
                        <span>可能认识/搜索用户</span>
                    </div>
                </template>
                <!-- 推荐用户列表 -->
                <el-row justify="space-between" v-for="item, index in searchpeo" :key="item.sid" class="maby">

                    <el-col :span="6">{{ item.susername }}</el-col>
                    <el-col :span="6" style="text-align: right;">
                        <!-- 添加好友 -->
                        <el-button class="button"
                            v-if="item.flag === -2 && !friendstr.includes(item.sid) && item.sid !== this.$store.state.userinfo.uid"
                            :icon="Plus" @click="madeFriends(index)">加好友</el-button>
                        <el-button class="button" v-else-if="item.flag === -1" disabled :icon="Check">等待同意</el-button>
                        <el-tag v-else>好友</el-tag>
                    </el-col>

                </el-row>
            </el-card>
        </div>
    </el-scrollbar>
</template>

<script>
import { getrequirefriends, getRequireStatus, getAxiosUser, userHasFriends, getAxiosOne, sendrequirefriend } from '@/server/usersign.js'
import { Check, Plus, Search } from '@element-plus/icons-vue'
export default {
    mounted() {
        // 获取用户的好友请求列表
        this.getflist()
        // 获取推荐好友列表
        getAxiosUser().then(res => {
            console.log(res);
            this.suspensePeop = res.data.data?.filter(item => item.sid !== this.$store.state.userinfo.uid).map(item => ({ ...item, flag: -2 }))
            this.searchpeo = res.data.data?.filter(item => item.sid !== this.$store.state.userinfo.uid).map(item => ({ ...item, flag: -2 }))

        })
        // 获取用户首页好友信息
        userHasFriends({ uid: this.$store.state?.userinfo?.uid }).then(res => {
            this.friendstr = res.data?.data[0] ? res.data?.data[0].userid : ''
        })
    },
    components: {
        Search,
    },
    computed: {
        Plus() {
            return Plus
        },
        Check() {
            return Check
        },
    },

    data() {
        return {
            flist: [],//好友请求列表
            friendstr: '',//用户好友
            suspensePeop: [],//推荐用户列表
            input4: '',
            searchpeo: [],//搜索用户数据
            flag: '',//防抖开关
        }
    },
    methods: {
        // 搜索用户
        search() {
            clearTimeout(this.flag)
            this.flag = setTimeout(() => {
                if (!this.input4) {
                    this.searchpeo = this.suspensePeop
                    return
                }
                getAxiosOne({ uname: this.input4 }).then(res => {
                    this.searchpeo = res.data.data
                })
            }, 500)
        },
        // 获取用户好友请求列表
        getflist() {
            getrequirefriends({ getid: this.$store.state.userinfo?.uid }).then(res => {
                if (res.data.code === 201) {
                    console.log(res.data.data);
                    this.flist = res.data?.data.filter(item => item.requestflag === -1)
                }
            })
        },
        // 同意好友申请
        agreefn(item) {
            getRequireStatus({ sid: item.senduserid, gid: item.getuserid, sflag: 1, gname: item.sendusername, sname: this.$store.state.userinfo?.susername })
                .then(res => {
                    if (res.data.code === 201) {
                        this.getflist()
                    }
                })
        },
        // 拒绝好友申请
        refusefn(item) {
            getRequireStatus({ sid: item.senduserid, gid: item.getuserid, sflag: 0 })
                .then(res => {
                    if (res.data.code === 201) {
                        this.getflist()
                    }
                })
        },
        // 添加好友
        madeFriends(index) {
            this.searchpeo[index].flag = -1
            // this.activeList[index] = { ...this.activeList[index], flag: -1 }
            console.log(this.searchpeo);
            // 发送添加好友请求
            sendrequirefriend({ uname: this.$store.state.userinfo.susername, fromid: this.$store.state.userinfo?.uid, getid: this.searchpeo[index].sid })
                .then(res => {
                    if (res.data.code === 201) {
                        console.log('请求成功！');
                    } else if (res.data.code === 202) {
                        console.log('请求已经存在！');
                    }
                })
        },
    }

}
</script>

<style lang="scss" scoped>
.box {
    overflow: auto;
    height: 100%;
    margin: 20px 400px 0;
    min-width: 300px;

    .search {
        margin-top: 20px;
    }

    .box-card {
        .maby {
            margin: 10px 0;
        }
    }
}
</style>