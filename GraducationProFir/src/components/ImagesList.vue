<template>
    <el-card class="box-card" shadow="never">
        <template #header>
            <div class="card-header">
                <span>照片</span>
            </div>
        </template>
        <div>
            <el-upload v-model:file-list="fileList" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </div>
    </el-card>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
export default {
    data() {
        return {
            fileList: [
                {
                    name: 'food.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                },

                {
                    name: 'food.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                },
            ],
            dialogVisible: false,
            dialogImageUrl: '',
        }
    },
    methods: {
        handleRemove(uploadfile, uploadfiles) {
            console.log(uploadfile);
        },
        handlePictureCardPreview(uploadfile) {
            console.log(uploadfile);
        }
    },
    components: {
        Plus,
    }
}
</script>

<style lang="scss" scoped></style>