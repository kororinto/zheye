<template>
    <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
        <router-link class="navbar-brand" to="/">者也专栏</router-link>
        <ul v-if="!user.isLogin" class="list-inline mb-0">
            <li class="list-inline-item">
                <router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link>
            </li>
            <li class="list-inline-item">
                <router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link>
            </li>
        </ul>
        <ul v-else class="list-inline mb-0">
            <li class="list-inline-item">
                <Dropdown :title="`你好 ${user.nickName}`" :dropdownList="dropdownList"></Dropdown>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'
import Dropdown, { DropdownItem } from './Dropdown.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { UserProps } from '../store'

export default defineComponent({
    name: 'GlobalHeader',
    components: {
        Dropdown
    },
    props: {
        user: {
            required: true,
            type: Object as PropType<UserProps>
        }
    },
    setup() {
        const router = useRouter()
        const store = useStore()
        const dropdownList: DropdownItem[] = [
            {
                title: '新建文章',
                click() {
                    router.push({ name: 'create' })
                }
            },
            {
                title: '编辑资料',
                disabled: true
            },
            {
                title: '退出登录',
                click() {
                    store.commit('logout')
                }
            }
        ]
        return {
            dropdownList
        }
    }
})
</script>
