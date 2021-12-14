<template>
    <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
        <router-link class="navbar-brand" to="/">者也专栏</router-link>
        <ul v-if="!user.isLogin" class="list-inline mb-0">
            <li class="list-inline-item">
                <router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link>
            </li>
            <li class="list-inline-item">
                <router-link to="/login" class="btn btn-outline-light my-2">注册</router-link>
            </li>
        </ul>
        <ul v-else class="list-inline mb-0">
            <li class="list-inline-item">
                <Dropdown :title="`你好 ${user.name}`" :dropdownList="dropdownList"></Dropdown>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'
import Dropdown, { DropdownItem } from './Dropdown.vue'

export interface UserInfo {
    isLogin: boolean
    id?: number
    name?: string
}

const dropdownList: DropdownItem[] = [
    {
        title: '新建文章'
    },
    {
        title: '编辑资料',
        disabled: true
    },
    {
        title: '退出登录'
    }
]

export default defineComponent({
    name: 'GlobalHeader',
    components: {
        Dropdown
    },
    props: {
        user: {
            required: true,
            type: Object as PropType<UserInfo>
        }
    },
    setup() {
        return {
            dropdownList
        }
    }
})
</script>
