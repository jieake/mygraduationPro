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
                <el-col :span="3">分享</el-col>
                <el-col class="head-s" :span="3" @click="sendFreshMsg">发送</el-col>
            </el-row>
            <el-scrollbar>
                <!-- 发表信息 -->
                <el-input @blur="inputBlr" :autofocus="true" :autosize="{ minRows: 21 }" v-model="textarea" maxlength="690"
                    :rows="2" type="textarea" placeholder="分享新鲜事..." show-word-limit ref="inputText" />
            </el-scrollbar>
            <div class="scrollbar-img-list">
                <el-upload :http-request="xhrImgUploadBefor" :before-upload="beforeAvatarUpload" :limit="9"
                    v-model:file-list="fileList" list-type="picture-card" :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>

                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" width="490" alt="Preview Image" />
                </el-dialog>
            </div>
            <!-- 添加图片和表情 -->
            <el-footer>
                <el-row :gutter="1">

                    <el-col :span="2">
                        <el-popover :visible="visible" placement="top" :width="160">
                            <!-- 表情列表 -->
                            <div @click="emoClick($event)" class="foot-emoj">
                                <span v-for="item, index in emojilist " :key="index" style="cursor: pointer;margin: 5px;"
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
                    </el-col>
                </el-row>
            </el-footer>
        </el-main>
        <el-aside width="350px" class="hidden-md-and-down">

        </el-aside>
    </el-container>
</template>

<script>
import { userPublish } from '@/server/usersign.js'
import { ElMessage } from 'element-plus'
import { Picture, ArrowLeft, Plus } from '@element-plus/icons-vue'
export default {
    data() {
        return {
            // 需要提交的post数据
            activeData: {
                sfreshauthor: '',
                sfreshcontent: {
                    txt: '',
                },
                sfreshauthorid: undefined,
            },
            // 图片列表
            fileList: [
            ],
            // 图片预览有关
            dialogImageUrl: '',
            dialogVisible: false,
            // 光标位置
            index: 0,
            // 用户动态信息
            textarea: '',
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
            url: 'https://ts1.cn.mm.bing.net/th/id/R-C.79017906e64f275778a71610af1a84bb?rik=WgHcHJr6LsMmCQ&riu=http%3a%2f%2fup.deskcity.org%2fpic_source%2f79%2f01%2f79%2f79017906e64f275778a71610af1a84bb.jpg&ehk=2CiY5T4za7dUzM0qS%2bZVowewauZAUEBpz1Kg61Y9Zno%3d&risl=&pid=ImgRaw&r=0',
        }
    },

    methods: {

        // 覆盖默认xhr行为
        xhrImgUploadBefor() { },
        // 文件格式检测
        beforeAvatarUpload(rawfile) {
            if (rawfile.size / 1024 / 1024 > 1.5) {
                ElMessage('图片过大！')
                return false
            }
            return true
        },
        // 动态发布
        sendFreshMsg() {
            // formdata格式化存储图片
            let formdata = new FormData()
            this.fileList.forEach(item => {
                formdata.append('actImg', item.raw)
            })
            // 获取用户动态信息
            this.activeData.sfreshauthor = this.$store.state.userinfo.susername
            this.activeData.sfreshauthorid = this.$store.state.userinfo.uid
            this.activeData.sfreshcontent.txt = this.textarea
            if (!this.activeData.sfreshcontent.txt) return ElMessage('内容不能为空！')
            formdata.append('activedata', JSON.stringify(this.activeData))
            // 调用接口发布动态
            userPublish(formdata).then(res => {
                if (res.data.code === 200) {
                    this.$router.push('/school/index')
                }
            })
        },
        // 图片移除
        handleRemove(uploadFile, uploadFiles) {
            // console.log(uploadFile, uploadFiles)
        },
        // 图片预览
        handlePictureCardPreview(uploadFile) {
            this.dialogImageUrl = uploadFile.url
            this.dialogVisible = true
        },
        // 文本域聚焦
        inputBlr(e) {
            this.$refs?.inputText?.focus()
            return false
        },
        // 表情点击事件
        emoClick(e) {
            if (e.target.nodeName !== 'SPAN') return
            // 在文本域中插入表情
            // 获取光标位置 this.$refs.inputText.textarea.selectionStart
            this.index = this.$refs.inputText.textarea.selectionStart
            let arr = this.textarea.split('')
            arr.splice(this.index, 0, e.target.innerText)
            this.textarea = arr.join('')
        },
    },
    components: {
        ArrowLeft,
        Picture,
        Plus,
    },
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


    .el-main {
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 0;

        .el-footer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 51px;
            border-top: 1px solid rgb(226, 226, 226);
            background-color: #fff;
            // 禁止文本选中
            user-select: none;

            .foot-emoj {

                user-select: none;

            }
        }

        .detail-head {
            width: 100%;
            padding: 10px 20px;
            background-color: #fff;

            .head-s {
                cursor: pointer;
                text-align: right;
                color: #409EFF;
            }
        }


    }
}
</style>