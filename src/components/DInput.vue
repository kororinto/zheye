<template>
    <div class="validate-input-container pb-3">
        <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': inputData.error }"
            v-model="inputData.val"
            @blur="validate"
        />
        <span class="invalid-feedback" style="display: block" v-if="inputData.error">{{
            inputData.message
        }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from '@vue/runtime-core'
interface RuleItem {
    type: 'required' | 'email' | 'range'
    message: string
}
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export default defineComponent({
    name: 'DInput',
    props: {
        rules: {
            type: Array as PropType<RuleItem[]>,
            required: true
        }
    },
    setup(props) {
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
                        passed = inputData.val.trim().length >= 6
                        break
                    default:
                        break
                }
                return passed
            })
            inputData.error = !passed
        }
        return {
            inputData,
            validate
        }
    }
})
</script>
