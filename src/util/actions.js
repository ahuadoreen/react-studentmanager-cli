import {CLEAR_LIST_STATE, LIST_STATE, CLEAR_LIST_DATA} from "./actionType";
import store from '../Store'

/**
 * 保存列表状态
 * @param data
 * @returns {Function}
 */
export const saveListState = (data) => {
    return () => {
        store.dispatch({
            type: LIST_STATE,
            ...data
        })
    }
}

/**
 * 清除列表状态
 * @returns {Function}
 */
export const clearListState = () => {
    return () => {
        store.dispatch({
            type: CLEAR_LIST_STATE
        })
    }
}

/**
 * 只清除列表数据
 * @returns {Function}
 */
export const clearListData = (data) => {
    return () => {
        store.dispatch({
            type: CLEAR_LIST_DATA,
            ...data
        })
    }
}
