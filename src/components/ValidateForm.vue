<template>
    <form class="validate-form-container">
        <slot></slot>
        <div class="submit-area" @click.prevent="onFormSubmit">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">提交</button>
            </slot>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onUnmounted } from '@vue/runtime-core'
import mitt from 'mitt'
type Validator = () => boolean
type Cleaner = () => void
type Events = {
    formItemCreated: Validator
    formItemClean: Cleaner
}
export const emitter = mitt<Events>()
export default defineComponent({
    name: 'ValidateForm',
    emits: ['formSubmit'],
    setup(props, context) {
        const validators: Validator[] = []
        const cleaners: Cleaner[] = []
        const onFormSubmit = () => {
            const passed = validators.map((validator) => validator()).every((item) => item)
            validators.forEach((item, index) => {
                const passed = item()
                !passed && cleaners[index]()
            })
            context.emit('formSubmit', passed)
        }
        const callback = (validator: Validator) => {
            validators.push(validator)
        }
        const callback2 = (cleaner: Cleaner) => {
            cleaners.push(cleaner)
        }
        // 父beforeCreate -> 父created -> 父beforeMount ->
        // 子beforeCreate -> 子created -> 子beforeMount ->
        // 子mounted->父mounted
        // emitter添加监听事件应该在子组件Mounted之前
        onBeforeMount(() => {
            emitter.on('formItemCreated', callback)
            emitter.on('formItemClean', callback2)
        })
        onUnmounted(() => {
            emitter.off('formItemCreated', callback)
            emitter.off('formItemClean', callback2)
            validators.splice(0)
            cleaners.splice(0)
        })
        return {
            onFormSubmit
        }
    }
})
</script>

<style></style>
