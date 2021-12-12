<template>
    <div class="row">
        <div v-for="item in columnList" :key="item.id" class="col-3 mb-4">
            <div class="card h-100 shadow" style="width: 18rem">
                <div class="card-body text-center">
                    <img :src="item.avatar" :alt="item.title" class="rounded-circle border border-lignt w-25 my-3" />
                    <h5 class="card-title">{{ item.title }}</h5>
                    <p class="card-text text-start">{{ item.description }}</p>
                    <a href="#" class="btn btn-outline-primary">Go somewhere</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'
export interface ListItem {
    id: number
    title: string
    avatar: string
    description: string
}
export default defineComponent({
    name: 'ColumnList',
    props: {
        list: {
            type: Array as PropType<ListItem[]>,
            required: true
        }
    },
    setup(props) {
        const columnList = props.list.map((item) => {
            item.avatar = item.avatar ? item.avatar : require('@/assets/logo.png')
            return item
        })
        return {
            columnList
        }
    }
})
</script>

<style></style>
