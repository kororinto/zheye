<template>
    <div class="login-page">
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">邮箱地址</label>
                <validate-input
                    :rules="emailRules"
                    v-model="emailVal"
                    placeholder="请输入邮箱地址"
                    type="text"
                    ref="inputRef"
                />
            </div>
            <div class="mb-3">
                <label class="form-label">密码</label>
                <validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
            </div>
        </validate-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RuleItem } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

interface LoginProps {
    email: string
    password: string
}
export default defineComponent({
    name: 'Login',
    components: {
        ValidateInput,
        ValidateForm
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const emailVal = ref('')
        const emailRules: RuleItem[] = [
            { type: 'required', message: '电子邮箱地址不能为空' },
            { type: 'email', message: '请输入正确的电子邮箱格式' }
        ]
        const passwordVal = ref('')
        const passwordRules: RuleItem[] = [{ type: 'required', message: '密码不能为空' }]
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const params: LoginProps = {
                    email: emailVal.value,
                    password: passwordVal.value
                }
                store.dispatch('loginAndFetch', params)
                router.push({ name: 'home' })
            }
        }
        return {
            emailRules,
            emailVal,
            passwordVal,
            passwordRules,
            onFormSubmit
        }
    }
})
</script>
