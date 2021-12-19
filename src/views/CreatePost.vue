<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
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
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps } from '../store'

export default defineComponent({
    name: 'CreatePost',
    components: {
        ValidateInput,
        ValidateForm
    },
    setup() {
        const router = useRouter()
        const store = useStore<GlobalDataProps>()
        const titleVal = ref('')
        const contentVal = ref('')
        const titleRules: RuleItem[] = []
        const contentRules: RuleItem[] = []
        const onFormSubmit = (result: boolean) => {
            if (result) {
                // 获取用户的id 也就是用户专栏的id
                const { id } = store.state.user
                if (id) {
                    // 创建文章
                    const post: PostProps = {
                        _id: Date.now().toString(),
                        title: titleVal.value,
                        content: contentVal.value,
                        createdAt: new Date().toString(),
                        column: id + ''
                    }
                    // 使用commit mutations 添加文章
                    store.commit('createPost', post)
                }
                // 跳转到专栏为id的页面
                router.push({ name: 'column', params: { id } })
            }
        }
        return {
            titleVal,
            contentVal,
            titleRules,
            contentRules,
            onFormSubmit
        }
    }
})
</script>

<style></style>
