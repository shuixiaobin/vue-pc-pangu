import { myGet, myPost } from './http'

export const servideNumInfo = params => myGet(`${PHP_URL}/v5/c/servicenumber/service_num_info`, params)
export const createQrcode = data => myPost(`${PHP_URL}/v5/c/servicenumber/add_service_number`, data)
export const editQrcode = data => myPost(`${PHP_URL}/v5/c/servicenumber/service_num_save`, data)
export const removeQrcode = data => myPost(`${PHP_URL}/v5/c/servicenumber/update_status`, data)
export const getServiceList = () => myGet(`${PHP_URL}/v5/c/servicenumber/cate_type`)
