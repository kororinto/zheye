<template>
    <div class="column-detail-page w-75 mx-auto">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img
                    :src="column.avatar ? column.avatar.url : `${require('../assets/logo.png')}`"
                    :alt="column.title"
                    class="rounded-circle border w-50"
                />
            </div>
            <div class="col-9">
                <h4>{{ column.title }}</h4>
                <p class="text-muted">{{ column.description }}</p>
            </div>
        </div>
        <post-list :list="postList"></post-list>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PostList from '../components/PostList.vue'
import { GlobalDataProps, ColumnProps, PostProps } from '../store'

export default defineComponent({
    name: 'ColumnDetail',
    components: {
        PostList
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const route = useRoute()
        const currentId = route.params.id
        onMounted(() => {
            // 获取专栏信息和专栏文章列表
            store.dispatch('fetchColumn', currentId)
            store.dispatch('fetchPosts', currentId)
        })
        const column = computed<ColumnProps>(() => store.getters.getColumnById(currentId))
        const postList = computed<PostProps[]>(() => store.getters.getPostsByColumnId(currentId))
        if (column.value && !column.value.avatar) {
            column.value.avatar = {
                url: require('@/assets/logo.png')
            }
        }
        return {
            route,
            column,
            postList
        }
    }
})
</script>

<style></style>
