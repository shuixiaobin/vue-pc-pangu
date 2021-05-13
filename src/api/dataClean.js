import { myGet, myPost } from './http'
export const createTask = params => myPost('//192.168.199.161:8019/lumenapi/v5/blue/outbound/create_task',params) //创建任务
export const getTaskList = params => myGet('//192.168.199.161:8019/lumenapi/v5/blue/outbound/task_list',params) //列表  

// export const createTask = params => myPost(`${PHP_URL}/v5/blue/outbound/create_task`,params) //创建任务
// export const getTaskList = params => myGet(`${PHP_URL}/v5/blue/outbound/task_list`,params) //列表  //192.168.199.161:8019/lumenapi/

export const getUserProxyList = params => myGet(`${PHP_URL}/v5/blue/notes/report_notes`,params)