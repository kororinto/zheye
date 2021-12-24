interface CheckCondition {
    format?: string[]
    size?: number
}
type ErrorType = 'size' | 'format' | null
interface checkRes {
    passed: boolean
    error: ErrorType
}
export function beforeUploadCheck(file: File, condition: CheckCondition): checkRes {
    const { format, size } = condition
    const isValidFormat = format ? format.includes(file.type) : true
    const isValidSize = size ? file.size / 1024 / 1024 < size : true
    let error: ErrorType = null
    if (!isValidFormat) {
        error = 'format'
    }
    if (!isValidSize) {
        error = 'size'
    }
    return {
        passed: isValidFormat && isValidSize,
        error
    }
}
