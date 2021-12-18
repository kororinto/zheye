<template>
    <GlobalHeader :user="currentUser"></GlobalHeader>
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
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'

export default defineComponent({
    name: 'App',
    components: {
        GlobalHeader,
        Footer
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const currentUser = computed(() => store.state.user)
        return {
            currentUser
        }
    }
})
</script>

<style></style>
