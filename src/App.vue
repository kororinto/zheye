<template>
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <Loader v-if="loading" background="rgba(0, 0, 0, 0.6)" text="正在加载中"></Loader>
    <div class="container">
        <router-view></router-view>
    </div>
    <Footer></Footer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Footer from './components/Footer.vue'
import Loader from './components/Loader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'

export default defineComponent({
    name: 'App',
    components: {
        GlobalHeader,
        Footer,
        Loader
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const currentUser = computed(() => store.state.user)
        const loading = computed(() => store.state.loading)
        return {
            currentUser,
            loading
        }
    }
})
</script>

<style></style>
