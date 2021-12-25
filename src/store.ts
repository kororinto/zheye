import axios from 'axios'
import { createStore, Commit } from 'vuex'
import router from './router'
import { arrToObj, objToArr } from './helper'

export interface ResProps<T = any> {
    code: number
    data: T
    msg: string
}

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
    _id?: string
    title: string
    excerpt?: string
    content?: string
    image?: ImageProps | string
    createdAt?: string
    column: string
    author?: string
    isHTML?: boolean
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
interface ListProps<T> {
    [index: string]: T
}
export interface GlobalDataProps {
    columns: ListProps<ColumnProps>
    posts: ListProps<PostProps>
    user: UserProps
    loading: boolean
    token: string
    error: ErrorProps
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await axios.get(url)
    commit(mutationName, data)
    return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await axios.post(url, payload)
    commit(mutationName, data)
    return data
}

const store = createStore<GlobalDataProps>({
    state: {
        error: { status: false },
        columns: {},
        posts: {},
        user: { isLogin: false },
        loading: false,
        token: localStorage.getItem('token') || ''
    },
    mutations: {
        createPost(state, post) {
            state.posts[post._id] = post
        },
        fetchColumns(state, rawData: ResProps) {
            state.columns = arrToObj(rawData.data.list)
        },
        fetchColumn(state, rawData: ResProps) {
            state.columns[rawData.data._id] = rawData.data
        },
        fetchPosts(state, rawData: ResProps) {
            state.posts = arrToObj(rawData.data.list)
        },
        fetchPost(state, rawData: ResProps) {
            state.posts[rawData.data._id] = rawData.data
        },
        fetchCurrentUser(state, rawData: ResProps) {
            state.user = { isLogin: true, ...rawData.data }
        },
        setLoading(state, status) {
            state.loading = status
        },
        setError(state, err) {
            state.error = err
        },
        login(state, rawData: ResProps) {
            const { token } = rawData.data
            state.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
        },
        logout(state) {
            localStorage.removeItem('token')
            state.token = ''
            state.user = { isLogin: false }
            delete axios.defaults.headers.common.Authorization
            router.push({ name: 'home' })
        }
    },
    actions: {
        fetchColumns({ commit }) {
            return getAndCommit('/columns?currentPage=1&pageSize=10', 'fetchColumns', commit)
        },
        fetchColumn({ commit }, columnId) {
            return getAndCommit(`/columns/${columnId}`, 'fetchColumn', commit)
        },
        fetchPosts({ commit }, columnId) {
            return getAndCommit(`/columns/${columnId}/posts`, 'fetchPosts', commit)
        },
        fetchPost({ commit }, id) {
            return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
        },
        fetchCurrentUser({ commit }) {
            return getAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        login({ commit }, payload) {
            return postAndCommit('/user/login', 'login', commit, payload)
        },
        createPost({ commit }, payload) {
            return postAndCommit('/posts', 'createPost', commit, payload)
        },
        async loginAndFetch({ dispatch }, loginData) {
            await dispatch('login', loginData)
            return await dispatch('fetchCurrentUser')
        }
    },
    getters: {
        getColumns: (state) => () => {
            return objToArr(state.columns)
        },
        getColumnById: (state) => (id: string) => {
            return state.columns[id]
        },
        getPostsByColumnId: (state) => (columnId: string) => {
            return objToArr(state.posts).filter((item) => item.column === columnId)
        },
        getPostById: (state) => (id: string) => {
            return state.posts[id]
        }
    }
})

export default store
