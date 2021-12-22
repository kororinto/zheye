<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
        <input type="file" name="file" @change.prevent="handleFileChange" />
        <Uploader
            action="/upload"
            :beforeUpload="beforeUpload"
            @fileUploaded="onFileUploaded"
            @fileUploadError="onFileUploadError"
            ref="uploadRef"
        >
            <h2>点击上传图片</h2>
            <template #uploading>
                <div class="spinner-border" role="status"></div>
            </template>
            <template #uploaded="{ uploadedData }">
                <img :src="uploadedData.data.url" width="500" @click.stop="deleteImg" />
            </template>
        </Uploader>
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题</label>
                <validate-input
                    :rules="titleRules"
                    v-model="titleVal"
                    placeholder="请输入文章标题"
                    type="text"
                    ref="inputRef"
                />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情</label>
                <validate-input
                    rows="10"
                    tag="textarea"
                    type="text"
                    placeholder="请输入文章详情"
                    :rules="contentRules"
                    v-model="contentVal"
                />
            </div>
            <template #submit>
                <button type="submit" class="btn btn-primary">创建</button>
            </template>
        </validate-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core'
import ValidateInput, { RuleItem } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import createMessage from '../components/createMessage'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps, ResProps, ImageProps } from '../store'
import axios from 'axios'

export default defineComponent({
    name: 'CreatePost',
    components: {
        ValidateInput,
        ValidateForm,
        Uploader
    },
    setup() {
        const router = useRouter()
        const store = useStore<GlobalDataProps>()
        const titleVal = ref('')
        const contentVal = ref('')
        const uploadRef = ref<any>(null)
        const titleRules: RuleItem[] = []
        const contentRules: RuleItem[] = []
        const onFormSubmit = (result: boolean) => {
            if (result) {
                // 获取用户的对应column
                const { column } = store.state.user
                if (column) {
                    // 创建文章
                    const post: PostProps = {
                        _id: Date.now().toString(),
                        title: titleVal.value,
                        content: contentVal.value,
                        createdAt: new Date().toString(),
                        column: column + ''
                    }
                    // 使用commit mutations 添加文章
                    store.commit('createPost', post)
                }
                // 跳转到专栏为id的页面
                router.push({ name: 'column', params: { column } })
            }
        }
        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement
            const files = target.files
            if (files && files.length) {
                const upLoadedFile = files[0]
                const formData = new FormData()
                formData.append(upLoadedFile.name, upLoadedFile)
                axios
                    .post('/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then((res) => {
                        console.log(res)
                    })
            }
        }
        const beforeUpload = (file: File) => {
            const isJPG = file.type === 'image/jpeg'
            if (!isJPG) {
                createMessage('上传图片只能是 JPG 格式', 'error')
            }
            return isJPG
        }
        const onFileUploaded = (rawData: ResProps<ImageProps>) => {
            createMessage(`图片id ${rawData.data._id}`, 'success')
        }
        const onFileUploadError = (err: ResProps<ImageProps>) => {
            console.log(err)
            createMessage(`文件过大`, 'error')
        }
        const deleteImg = (e: Event) => {
            const target = e.target as HTMLImageElement
            target.src = ''
            uploadRef.value.fileStatus = 'ready'
        }
        return {
            titleVal,
            contentVal,
            titleRules,
            contentRules,
            onFormSubmit,
            handleFileChange,
            beforeUpload,
            onFileUploaded,
            onFileUploadError,
            deleteImg,
            uploadRef
        }
    }
})
</script>

<style></style>
