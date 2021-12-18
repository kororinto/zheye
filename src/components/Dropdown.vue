<template>
    <div class="dropdown" ref="dropdownRef">
        <a class="btn btn-outline-light my-2 dropdown-toggle" href="#" @click.prevent="toggle">{{ title }}</a>
        <ul class="dropdown-menu" style="display: block; left: -68%" v-show="visible">
            <li v-for="(item, index) in dropdownList" :key="index">
                <router-link class="dropdown-item" :class="{ disabled: item.disabled }" to="/create">{{
                    item.title ? item.title : '下拉选项'
                }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from '@vue/runtime-core'
import useClickOutside from '../hooks/useClickOutside'

export interface DropdownItem {
    title?: string
    disabled?: boolean
}

export default defineComponent({
    name: 'Dropdown',
    props: {
        title: {
            type: String,
            default: '下拉菜单'
        },
        dropdownList: {
            type: Array as PropType<DropdownItem[]>,
            default: () => []
        }
    },
    setup(props) {
        const visible = ref(false)
        const dropdownRef = ref<null | HTMLElement>(null)
        const isClickOutside = useClickOutside(dropdownRef)
        const toggle = () => {
            if (props.dropdownList.length) {
                visible.value = !visible.value
            }
        }
        watch(isClickOutside, (val) => {
            if (visible.value && val) {
                visible.value = false
            }
        })
        return {
            visible,
            toggle,
            dropdownRef,
            isClickOutside
        }
    }
})
</script>

<style>
.dropdown-menu .disabled {
    color: #6c757d;
    pointer-events: none;
    background-color: transparent;
}
</style>
