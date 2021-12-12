import { onMounted, onUnmounted, ref, Ref } from 'vue'

const useClickOutside = (HTMLRef: Ref<null | HTMLElement>): Ref<boolean> => {
    const res = ref(false)
    const clickHandler = (e: MouseEvent) => {
        if (HTMLRef.value && !HTMLRef.value.contains(e.target as HTMLElement)) {
            res.value = true
        } else {
            res.value = false
        }
    }
    onMounted(() => {
        document.addEventListener('click', clickHandler)
    })
    onUnmounted(() => {
        document.addEventListener('click', clickHandler)
    })
    return res
}
export default useClickOutside
