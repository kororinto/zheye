import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

const icode = '7E5F1895F4CE0227'
axios.defaults.baseURL = 'http://apis.imooc.com/api'
axios.interceptors.request.use((config) => {
    // get请求 添加到url中
    if (config.method === 'get') {
        config.params = {
            ...config.params,
            icode
        }
    }
    // 其他请求 添加到body中
    // 上传文件 添加到FormData中
    else if (config.data instanceof FormData) {
        config.data.append('icode', icode)
    }
    // 普通body对象 添加到data中
    else {
        config.data = { ...config.data, icode }
    }
    // loading状态
    store.commit('setLoading', true)
    // error状态置为false
    store.commit('setError', { status: false, message: '' })
    return config
})
axios.interceptors.response.use(
    (config) => {
        // loading状态
        store.commit('setLoading', false)
        return config
    },
    (e) => {
        // console.dir(e)
        const { error } = e.response.data
        store.commit('setError', { status: true, message: error })
        store.commit('setLoading', false)
        return Promise.reject(error)
    }
)
createApp(App).use(router).use(store).mount('#app')
