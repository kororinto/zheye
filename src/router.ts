import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import Signup from './views/Signup.vue'
import store from './store'
import axios from 'axios'

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { redirectAlreadyLogin: true }
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup
        },
        {
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        },
        {
            path: '/create',
            name: 'create',
            component: CreatePost,
            meta: { requiredLogin: true }
        }
    ]
})
router.beforeEach((to, from, next) => {
    const { user, token } = store.state
    const { redirectAlreadyLogin, requiredLogin } = to.meta
    // 判断是否登录
    if (user.isLogin) {
        // 已登录
        // 判断跳转的路由meta参数中的redirectAlreadyLogin
        if (redirectAlreadyLogin) {
            // 已登录则跳转到首页
            next('/')
        } else {
            next()
        }
    } else {
        // 未登录
        // 检查token
        if (token) {
            console.log(token)
            // token已存在 获取用户信息
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
            store
                .dispatch('fetchCurrentUser')
                .then(() => {
                    if (redirectAlreadyLogin) {
                        // 已登录则跳转到首页
                        next('/')
                    } else {
                        next()
                    }
                })
                .catch((err) => {
                    console.dir(err)
                    localStorage.removeItem('token')
                    next('/login')
                })
        } else {
            if (requiredLogin) {
                next('/login')
            } else {
                next()
            }
        }
    }
    // if (to.meta.requiredLogin && !store.state.user.isLogin) {
    //     next({ name: 'login' })
    // } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    //     next({ name: 'home' })
    // } else {
    //     next()
    // }
})

export default router
