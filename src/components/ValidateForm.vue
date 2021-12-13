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
type Events = {
    formItemCreated: Validator
}
type Validator = () => boolean
export const emitter = mitt<Events>()
export default defineComponent({
    name: 'ValidateForm',
    emits: ['formSubmit'],
    setup(props, context) {
        const validators: Validator[] = []
        const onFormSubmit = () => {
            const passed = validators.map((validator) => validator()).every((item) => item)
            context.emit('formSubmit', passed)
        }
        const callback = (validator: Validator) => {
            validators.push(validator)
        }
        // 父beforeCreate -> 父created -> 父beforeMount ->
        // 子beforeCreate -> 子created -> 子beforeMount ->
        // 子mounted->父mounted
        // emitter添加监听事件应该在子组件Mounted之前
        onBeforeMount(() => {
            emitter.on('formItemCreated', callback)
        })
        onUnmounted(() => {
            emitter.off('formItemCreated', callback)
            validators.splice(0)
        })
        return {
            onFormSubmit
        }
    }
})
</script>

<style></style>
