/**
 * 用于添加监听函数的辅助类。
 */
export default class Listener<T> {
    private list: ((params?: T) => void)[] = [];

    /**
     * 向此监听点添加一个新的回调函数。
     * @param call 
     */
    addListener(call: (params?: T) => void) {
        this.list.push(call);
    }
    /**
     * 从此监听点移除一个回调函数。
     * @param call 
     */
    removeListener(call: (params?: T) => void) {
        for(let i = 0; i < this.list.length; ++i) {
            if(this.list[i] == call) {
                this.list.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 监听点的控制方提交事件，它将传播到所有的回调函数。
     * @param content 
     */
    emit(content?: T) {
        for(let i of this.list) {
            i(content);
        }
    }
}