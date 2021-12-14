<template>
    <GlobalHeader :user="user"></GlobalHeader>
    <div class="container">
        <router-view></router-view>
    </div>
    <Footer></Footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader, { UserInfo } from './components/GlobalHeader.vue'
import Footer from './components/Footer.vue'

const user: UserInfo = {
    isLogin: false
}
export default defineComponent({
    name: 'App',
    components: {
        GlobalHeader,
        Footer
    },
    setup() {
        return {
            user
        }
    }
})
</script>

<style></style>
