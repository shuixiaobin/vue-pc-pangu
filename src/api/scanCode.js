import { myGet, myPost, myPut } from './http'

export const addActivityCode = params => myPost(`${PHP_URL}/v5/blue/activitycode/add_activity_code`, params)
export const editActivityCode = params => myPut(`${PHP_URL}/v5/blue/activitycode/save_activity_code`, params)
export const getActivityCodeList = params => myGet(`${PHP_URL}/v5/blue/activitycode/activity_code_list`, params)
export const getActivityCodeDetail = params => myGet(`${PHP_URL}/v5/blue/activitycode/activity_code_info`, params)
export const changeStatus = params => myPut(`${PHP_URL}/v5/blue/activitycode/save_status`, params)
