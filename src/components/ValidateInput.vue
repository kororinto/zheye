<template>
    <div class="validate-input-container pb-3">
        <input
            class="form-control"
            :class="{ 'is-invalid': inputData.error }"
            :value="inputData.val"
            @blur="validate"
            @input="upDateValue"
            v-bind="$attrs"
        />
        <span class="invalid-feedback" style="display: block" v-if="inputData.error">{{ inputData.message }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive } from '@vue/runtime-core'
import { emitter } from './ValidateForm.vue'

interface RuleItem {
    type: 'required' | 'email' | 'range'
    message: string
    min?: {
        message: string
        length: number
    }
    max?: {
        message: string
        length: number
    }
}
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export default defineComponent({
    name: 'ValidateInput',
    inheritAttrs: false,
    props: {
        rules: {
            type: Array as PropType<RuleItem[]>,
            required: true
        },
        modelValue: {
            type: String
        }
    },
    setup(props, context) {
        const inputData = reactive({
            val: '',
            error: false,
            message: ''
        })
        const validate = () => {
            const passed = props.rules.every((item) => {
                let passed = true
                inputData.message = item.message
                switch (item.type) {
                    case 'required':
                        passed = inputData.val.trim() !== ''
                        break
                    case 'email':
                        passed = emailReg.test(inputData.val)
                        break
                    case 'range':
                        if (item.min && (inputData.val.length < item.min.length || inputData.val.includes(' '))) {
                            passed = false
                            inputData.message = item.min.message
                        } else if (
                            item.max &&
                            (inputData.val.length > item.max.length || inputData.val.includes(' '))
                        ) {
                            passed = false
                            inputData.message = item.max.message
                        }
                        break
                    default:
                        break
                }
                return passed
            })
            inputData.error = !passed
            return passed
        }
        const upDateValue = (e: KeyboardEvent) => {
            const newValue = (e.target as HTMLInputElement).value
            inputData.val = newValue
            context.emit('update:modelValue', newValue)
        }
        onMounted(() => {
            emitter.emit('formItemCreated', validate)
        })
        return {
            inputData,
            validate,
            upDateValue
        }
    }
})
</script>
