<template>
    <GlobalHeader :user="user"></GlobalHeader>
    <div class="container">
        <form action="">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
                <DInput
                    :rules="[
                        { type: 'required', message: '请输入邮箱地址' },
                        { type: 'email', message: '请输入正确格式的邮箱地址' }
                    ]"
                    v-model="email.val"
                    placeholder="请输入邮箱地址"
                    type="text"
                ></DInput>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">密码</label>
                <DInput
                    :rules="[
                        { type: 'required', message: '请输入密码' },
                        {
                            type: 'range',
                            min: { message: '请输入6位以上且不含空格', length: 6 },
                            max: { message: '请输入18位以下且不含空格', length: 18 }
                        }
                    ]"
                    v-model="password.val"
                    placeholder="请输入密码"
                    type="password"
                ></DInput>
            </div>
        </form>
        <ColumnList :list="list"></ColumnList>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList, { ListItem } from './components/ColumnList.vue'
import GlobalHeader, { UserInfo } from './components/GlobalHeader.vue'
import DInput from './components/DInput.vue'
const list: ListItem[] = [
    {
        id: 1,
        title: '标题1',
        avatar: '',
        description: '一些描述一些描述一些描述一些描述一些描述一些描述一些描述'
    },
    {
        id: 2,
        title: '标题2',
        avatar: '',
        description: '一些描述一些描述一些描述一些描述一些描述一些描述一些描述'
    },
    {
        id: 3,
        title: '标题3',
        avatar: '',
        description: '一些描述一些描述一些描述一些描述一些描述一些描述一些描述'
    },
    {
        id: 4,
        title: '标题4',
        avatar: '',
        description: '一些描述一些描述一些描述一些描述一些描述一些描述一些描述'
    }
]
const user: UserInfo = {
    isLogin: true,
    name: 'dx'
}
export default defineComponent({
    name: 'App',
    components: {
        ColumnList,
        GlobalHeader,
        DInput
    },
    setup() {
        const email = reactive({
            val: '',
            error: false,
            message: ''
        })
        const password = reactive({
            val: '',
            error: false,
            message: ''
        })
        return {
            list,
            user,
            email,
            password
        }
    }
})
</script>

<style></style>
