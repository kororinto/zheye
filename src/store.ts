import { createStore } from 'vuex'
import { testData, testPosts } from './testData'
export interface UserProps {
    isLogin: boolean
    name?: string
    id?: number
}
export interface GlobalDataProps {
    columns: ColumnProps[]
    posts: PostProps[]
    user: UserProps
}
export interface ColumnProps {
    id: number
    title: string
    avatar?: string
    description: string
}
export interface PostProps {
    id: number
    title: string
    content: string
    image?: string
    createdAt: string
    columnId: number
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: testData,
        posts: testPosts,
        user: { isLogin: true, name: 'dx', id: 1 }
    },
    mutations: {
        login(state) {
            state.user = { isLogin: true, name: 'dx', id: 1 }
        },
        createPost(state, post) {
            state.posts.push(post)
        }
    },
    getters: {
        getColumnById: (state) => (id: number) => {
            return state.columns.find((item) => item.id === id)
        },
        getPostsByColumnId: (state) => (columnId: number) => {
            return state.posts.filter((item) => item.columnId === columnId)
        }
    }
})

export default store
