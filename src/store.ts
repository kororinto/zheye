import axios from 'axios'
import { createStore } from 'vuex'
export interface UserProps {
    isLogin: boolean
    name?: string
    id?: number
}
export interface GlobalDataProps {
    columns: ColumnProps[]
    posts: PostProps[]
    user: UserProps
    loading: boolean
}
export interface AvatarProps {
    _id?: string
    url?: string
    createdAt?: string
}
export interface ColumnProps {
    _id: string
    title: string
    avatar?: AvatarProps
    description: string
}
export interface PostProps {
    _id: string
    title: string
    excerpt?: string
    content?: string
    image?: AvatarProps
    createdAt: string
    column: string
}
interface GetDataAndMutateStateParams {
    url: string
    mutationName: string
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: [],
        posts: [],
        user: { isLogin: true, name: 'dx', id: 1 },
        loading: false
    },
    mutations: {
        login(state) {
            state.user = { isLogin: true, name: 'dx', id: 1 }
        },
        createPost(state, post) {
            state.posts.push(post)
        },
        getColumns(state, rawData) {
            state.columns = rawData.data.list
        },
        getColumn(state, rawData) {
            state.columns = [rawData.data]
        },
        getPosts(state, rawData) {
            state.posts = rawData.data.list
        },
        setLoading(state, status) {
            state.loading = status
        }
    },
    actions: {
        async getDataAndMutateState({ commit }, options: GetDataAndMutateStateParams) {
            const { data } = await axios.get(options.url)
            commit(options.mutationName, data)
        }
    },
    getters: {
        getColumnById: (state) => (id: string) => {
            return state.columns.find((item) => item._id === id)
        },
        getPostsByColumnId: (state) => (columnId: string) => {
            return state.posts.filter((item) => item.column === columnId)
        }
    }
})

export default store
