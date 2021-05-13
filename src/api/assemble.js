import { myGet, myPost, myPut } from './http'

export const getAssemble = params => myGet(`${PHP_URL}/v4/blue/blueCollage/collage_list`, params)
export const getClasses = params => myGet(`${PHP_URL}/v4/blue/blueCollage/collage_classes`, params)
export const createActive = data => myPost(`${PHP_URL}/v4/blue/blueCollage/add_collage`, data)
export const getActivityData = id => myGet(`${PHP_URL}/v4/blue/blueCollage/collage_details?activityId=${id}`)
export const editActive = data => myPut(`${PHP_URL}/v4/blue/blueCollage/collage_details_update`, data)
export const changeStatus = data => myPut(`${PHP_URL}/v4/blue/blueCollage/collage_update`, data)
export const getEffect = id => myGet(`${PHP_URL}/v4/blue/blueCollage/effect_query`, {activityId: id})
