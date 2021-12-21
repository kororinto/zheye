import { createApp } from 'vue'
import Message from './Message.vue'

const createMessage = (message: string, type: MessageType, timeout = 2000): void => {
    // 创建组件实例
    const messageInstance = createApp(Message, {
        type,
        message
    })
    // 挂载到dom上
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    messageInstance.mount(mountNode)
    setTimeout(() => {
        messageInstance.unmount()
        document.body.removeChild(mountNode)
    }, timeout)
}

export type MessageType = 'success' | 'error' | 'default'
export default createMessage
