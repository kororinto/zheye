<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
        <input type="file" name="file" @change.prevent="handleFileChange" />
        <Uploader
            action="/upload"
            :beforeUpload="uploadCheck"
            @fileUploaded="onFileUploaded"
            @fileUploadError="onFileUploadError"
            ref="uploadRef"
            class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
        >
            <h2>点击上传图片</h2>
            <template #uploading>
                <div class="spinner-border" role="status"></div>
                <h2>上传中...</h2>
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
import { beforeUploadCheck } from '../helper'

export default defineComponent({
    name: 'CreatePost',
    components: {
        ValidateInput,
        ValidateForm,
        Uploader
    },
    setup() {
        let imageId = ''
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
                const { column, _id } = store.state.user
                if (column) {
                    const newPost: PostProps = {
                        title: titleVal.value,
                        content: contentVal.value,
                        column,
                        author: _id
                    }
                    if (imageId) {
                        newPost.image = imageId
                    }
                    store.dispatch('createPost', newPost).then(() => {
                        createMessage('发表成功~', 'success')
                        // 跳转到专栏为id的页面
                        router.push({ name: 'column', params: { id: column } })
                    })
                }
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
        // const beforeUpload = (file: File) => {
        //     const isJPG = file.type === 'image/jpeg'
        //     if (!isJPG) {
        //         createMessage('上传图片只能是 JPG 格式', 'error')
        //     }
        //     return isJPG
        // }
        // const onFileUploaded = (rawData: ResProps<ImageProps>) => {
        //     createMessage(`图片id ${rawData.data._id}`, 'success')
        // }
        // 获取图片id
        const onFileUploaded = (rawData: ResProps<ImageProps>) => {
            if (rawData.data._id) {
                imageId = rawData.data._id
            }
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
        const uploadCheck = (file: File) => {
            const res = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
            const { passed, error } = res
            if (error === 'format') {
                createMessage('上传文件只能是 JPG/PNG 格式', 'error')
            }
            if (error === 'size') {
                createMessage('上传文件大小不能超过1Mb', 'error')
            }
            return passed
        }
        return {
            titleVal,
            contentVal,
            titleRules,
            contentRules,
            onFormSubmit,
            handleFileChange,
            // beforeUpload,
            onFileUploaded,
            onFileUploadError,
            deleteImg,
            uploadCheck,
            uploadRef
        }
    }
})
</script>

<style>
.create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer;
}
.create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
