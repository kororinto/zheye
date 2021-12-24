<template>
    <div class="file-upload">
        <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
            <slot v-if="fileStatus === 'ready'">
                <button class="btn btn-primary">点击上传</button>
            </slot>
            <slot v-if="fileStatus === 'loading'" name="uploading">
                <button class="btn btn-primary">正在上传</button>
            </slot>
            <slot v-if="fileStatus === 'success'" name="uploaded" :uploadedData="fileData">
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot v-if="fileStatus === 'error'" name="error">
                <button class="btn btn-primary">上传失败</button>
            </slot>
        </div>
        <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/runtime-core'
import axios from 'axios'

type fileStatus = 'ready' | 'loading' | 'success' | 'error'
type checkFunction = (file: File) => boolean

export default defineComponent({
    name: 'Uploader',
    props: {
        action: {
            type: String,
            required: true
        },
        beforeUpload: {
            type: Function as PropType<checkFunction>
        }
    },
    inheritAttrs: false,
    setup(props, context) {
        const fileInput = ref<null | HTMLInputElement>(null)
        const fileStatus = ref<fileStatus>('ready')
        const fileData = ref()
        const triggerUpload = () => {
            if (fileInput.value) {
                fileInput.value.click()
            }
        }
        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement
            if (target.files && target.files.length) {
                const file = target.files[0]
                // beforeUpload
                if (props.beforeUpload) {
                    const res = props.beforeUpload(file)
                    if (!res) {
                        return
                    }
                }
                fileStatus.value = 'loading'
                const formData = new FormData()
                formData.append(file.name, file)
                axios
                    .post(props.action, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then((res) => {
                        fileStatus.value = 'success'
                        context.emit('fileUploaded', res.data)
                        fileData.value = res.data
                    })
                    .catch((err) => {
                        fileStatus.value = 'error'
                        context.emit('fileUploadError', err)
                    })
                    .finally(() => {
                        if (fileInput.value) {
                            fileInput.value.value = ''
                        }
                    })
            }
        }
        return {
            fileInput,
            fileStatus,
            fileData,
            triggerUpload,
            handleFileChange
        }
    }
})
</script>

<style></style>
