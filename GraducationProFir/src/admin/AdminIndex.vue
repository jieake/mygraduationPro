<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <ul>
                    <li @click="comname = 'AdminUser'">用户管理</li>
                    <li @click="comname = 'AdminMsg'">通告管理</li>
                </ul>
            </el-aside>
            <el-container>
                <el-header style="font-size: 15px;line-height: 60px;background-color: #292121;color: white;">
                    <el-row justify="space-between">
                        <el-col :span="12">
                            {{ timer }}
                        </el-col>
                        <el-col :span="12">
                            欢迎您：管理员admin
                            <el-button type="danger" @click="$router.push('/school/index')">退出</el-button>
                        </el-col>
                    </el-row>
                </el-header>
                <el-main>
                    <component :is="comname"></component>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<script>
import AdminUser from '@/admin/AdminUser.vue'
import AdminMsg from '@/admin/AdminMsg.vue'
export default {
    data() {
        return {
            comname: 'AdminUser',
            timer: '',
        }
    },
    components: {
        AdminUser,
        AdminMsg,
    },

    mounted() {
        this.timer = new Date().toLocaleString()
        setInterval(() => {
            this.timer = new Date().toLocaleString()
        }, 1000)
    },
}
</script>
  
<style lang="scss" scoped>
.common-layout {
    height: 100%;

    .el-container {
        height: 100%;
    }
}

.el-aside {
    background-color: #292121;

    ul {
        li {
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: white;
            cursor: pointer;

            &:hover {
                background-color: #500101;
            }
        }
    }
}
</style>