import {CLEAR_LIST_STATE, LIST_STATE, CLEAR_LIST_DATA} from "./actionType";

const initListState = {
    listData: [],//列表数据
    pagination: {pageSize: 5},//当前分页页码
}

const teacherListState = (state = initListState, action) => {
    if (action === undefined) {
        return state
    }

    switch (action.type) {
        case LIST_STATE:
            //更新列表状态
            return {
                ...state,
                ...action
            }
        case CLEAR_LIST_STATE:
            //清空列表状态
            return initListState
        case CLEAR_LIST_DATA:
            return {
                ...state,
                ...action
            }
        default:
            return state
    }

}

export default teacherListState
