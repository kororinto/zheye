<template>
    <div class="row">
        <div v-for="item in columnList" :key="item._id" class="col-3 mb-4">
            <div class="card h-100 shadow" style="width: 18rem">
                <div class="card-body text-center">
                    <img
                        :src="item.avatar && item.avatar.url"
                        :alt="item.title"
                        class="rounded-circle border border-lignt my-3"
                    />
                    <h5 class="card-title">{{ item.title }}</h5>
                    <p class="card-text text-start">{{ item.description }}</p>
                    <router-link :to="`/column/${item._id}`" class="btn btn-outline-primary">查看详情</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/runtime-core'
import { ColumnProps } from '../store'

export default defineComponent({
    name: 'ColumnList',
    props: {
        list: {
            type: Array as PropType<ColumnProps[]>,
            required: true
        }
    },
    setup(props) {
        const columnList = computed(() => {
            return props.list.map((item) => {
                if (!item.avatar) {
                    item.avatar = {
                        url: require('@/assets/logo.png')
                    }
                }
                return item
            })
        })
        return {
            columnList
        }
    }
})
</script>

<style scoped>
.card-body img {
    width: 60px;
    height: 60px;
}
</style>
