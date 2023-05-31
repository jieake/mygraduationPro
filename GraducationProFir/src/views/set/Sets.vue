<template>
    <div class="set">
        <el-tabs type="border-card" class="demo-tabs">
            <el-tab-pane label="个人账号管理">
                <PersonAcount></PersonAcount>
            </el-tab-pane>
            <el-tab-pane label="个人信息设置">
                <PersonInfoSet></PersonInfoSet>
            </el-tab-pane>
            <el-tab-pane label="头像设置">
                <PersonAvatar></PersonAvatar>
            </el-tab-pane>
            <el-tab-pane label="个人简介">
                <PersonIntroduction></PersonIntroduction>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import PersonAcount from './PersonAcount.vue'
import PersonAvatar from './PersonAvatar.vue'
import PersonInfoSet from './PersonInfoSet.vue'
import PersonIntroduction from './PersonIntroduction.vue'

export default {
    data() {
        return {

        }
    },
    components: {
        PersonAcount,
        PersonAvatar,
        PersonInfoSet,
        PersonIntroduction,
    }
}
</script>

<style lang="scss" scoped>
.set {
    flex: 1;

    .el-tabs {
        margin: 100px 300px 0;
    }
}
</style>