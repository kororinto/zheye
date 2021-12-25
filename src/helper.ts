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

export const arrToObj = <T extends { _id?: string }>(arr: T[]): { [key: string]: T } => {
    return arr.reduce((previousValue, currentValue) => {
        if (currentValue._id) {
            previousValue[currentValue._id] = currentValue
        }
        return previousValue
    }, {} as { [key: string]: T })
}

export const objToArr = <T>(obj: { [key: string]: T }): T[] => {
    return Object.keys(obj).map((item) => obj[item])
}
