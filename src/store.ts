import axios from 'axios'
import { createStore, Commit } from 'vuex'
import router from './router'

export interface ImageProps {
    _id?: string
    url?: string
    createdAt?: string
}
export interface ColumnProps {
    _id: string
    title: string
    avatar?: ImageProps
    description: string
}
export interface PostProps {
    _id: string
    title: string
    excerpt?: string
    content?: string
    image?: ImageProps
    createdAt: string
    column: string
}
export interface UserProps {
    isLogin: boolean
    _id?: string
    nickName?: string
    email?: string
    column?: string
    description?: string
    avatar?: ImageProps
}
export interface ErrorProps {
    status: boolean
    message?: string
}
export interface GlobalDataProps {
    columns: ColumnProps[]
    posts: PostProps[]
    user: UserProps
    loading: boolean
    token: string
    error: ErrorProps
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await axios.get(url)
    commit(mutationName, data)
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await axios.post(url, payload)
    commit(mutationName, data)
    return data
}

const store = createStore<GlobalDataProps>({
    state: {
        error: { status: false },
        columns: [],
        posts: [],
        user: { isLogin: false },
        loading: false,
        token: localStorage.getItem('token') || ''
    },
    mutations: {
        createPost(state, post) {
            state.posts.push(post)
        },
        fetchColumns(state, rawData) {
            state.columns = rawData.data.list
        },
        fetchColumn(state, rawData) {
            state.columns = [rawData.data]
        },
        fetchPosts(state, rawData) {
            state.posts = rawData.data.list
        },
        fetchCurrentUser(state, rawData) {
            state.user = { isLogin: true, ...rawData.data }
        },
        setLoading(state, status) {
            state.loading = status
        },
        setError(state, err) {
            state.error = err
        },
        login(state, rawData) {
            const { token } = rawData.data
            state.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
        },
        logout(state) {
            localStorage.removeItem('token')
            state.token = ''
            router.push({ name: 'home' })
            location.reload()
        }
    },
    actions: {
        fetchColumns({ commit }) {
            getAndCommit('/columns', 'fetchColumns', commit)
        },
        fetchColumn({ commit }, columnId) {
            getAndCommit(`/columns/${columnId}`, 'fetchColumn', commit)
        },
        fetchPosts({ commit }, columnId) {
            getAndCommit(`/columns/${columnId}/posts`, 'fetchPosts', commit)
        },
        fetchCurrentUser({ commit }) {
            getAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        login({ commit }, payload) {
            return postAndCommit('/user/login', 'login', commit, payload)
        },
        async loginAndFetch({ dispatch }, loginData) {
            await dispatch('login', loginData)
            return await dispatch('fetchCurrentUser')
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
