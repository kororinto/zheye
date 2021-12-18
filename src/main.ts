import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

axios.get('http://apis.imooc.com/api/columns?icode=7E5F1895F4CE0227&currentPage=1&pageSize=5')
createApp(App).use(router).use(store).mount('#app')
