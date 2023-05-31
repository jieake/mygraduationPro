<template>
    <el-upload class="avatar-uploader" :auto-upload="false" :http-request="xhrSendImg" :show-file-list="false"
        :on-change="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>
    <div style="margin-top: 15px;">
        <el-button type="primary" :icon="Delete" @click="handleRemove" />
        <el-button type="primary" @click="xhrSendImg">
            确认上传<el-icon class="el-icon--right">
                <Upload />
            </el-icon>
        </el-button>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { Plus, Upload, Delete } from '@element-plus/icons-vue'
import { setAxiosAvatars } from '@/server/usersign.js'
export default {
    data() {
        return {
            imageUrl: '',//图片本地地址
            fileimg: '',//图片对象
        }
    },
    components: {
        Plus,
        Upload,
    },
    computed: {
        Delete() {
            return Delete
        }
    },
    methods: {
        // 自定义上传
        xhrSendImg(handlefile) {
            console.log(handlefile);
            if (!this.imageUrl) {
                return
            }
            // 图片上传
            // 验证成功
            let formData = new FormData()
            // formData.append('avatar', this.fileimg)
            let formObj = {
                sid: this.$store.state.userinfo.uid,
                sflag: 3,
            }

            formData.append('avatar', this.fileimg)

            formData.append('userinfo', JSON.stringify(formObj))

            setAxiosAvatars(formData).then(res => {
                if (res.data.code === 200) {
                    this.imageUrl = ''
                }
            })
        },

        // 在头像上传之前
        beforeAvatarUpload(uploadfile) {
            let imagelist = ['image/jpeg', 'image/png']
            if (!imagelist.includes(uploadfile.raw?.type)) {
                ElMessage.error('图片格式必须是jpg或png！')
                return false
            } else if (uploadfile.raw.size / 1024 / 1024 > 1) {
                ElMessage.error('图片不能大于1MB!')
                return false
            }
            this.fileimg = uploadfile.raw
            this.imageUrl = URL.createObjectURL(uploadfile.raw)
            return true
        },
        // 图片移除
        handleRemove() {
            this.imageUrl = ''
        },
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;

}

.avatar-uploader .el-upload {
    border: 1px dashed gray;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    border: 1px dashed gray;
}
</style>