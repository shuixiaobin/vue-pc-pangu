import { myGet, myPut, myPost, myPost2, } from './http'

//小鹅通
export const getXiaoetongClassList = (params) => myGet(`${PANGU_URL}/v1/c/xet/xet_class_list`, params) // 小鹅通课程列表
export const getXiaoetongBindClass = (params) => myPost(`${PANGU_URL}/v1/c/xet/xet_class_relation`, params) // 小鹅通课程绑定