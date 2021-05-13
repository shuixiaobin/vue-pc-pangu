import { myGet, myPost } from "./http";
// 添加合作方
export const addPartner = params => {
  return myPost(`${PHP_URL}/v5/blue/course/parnter_add`, params)
}
// 查看合作方
export const lookPartner = params => {
  return myGet(`${PHP_URL}/v5/blue/course/parnter_info`, params)
}
// 查看合作方列表
export const  parnterList = params => {
  return myGet(`${PHP_URL}/v5/blue/course/parnter_list`, params)
}
// 添加课程列表
export const addClassList = params => {
  return myGet(`${PHP_URL}/v5/blue/course/class_list`, params)
}

// 添加合集列表
export const addCollectList = params => {
  return myGet(`${PHP_URL}/v5/blue/course/collect_list`, params)
}

// 添加自动上下线合集列表
export const addAutoCollectList = params => {
  return myGet(`${PHP_URL}/v5/blue/course/auto_collect_list`, params)
}

// 添加课程/合集/自动上下线 
export const addPartnerClass = params => {
  return myPost(`${PHP_URL}/v5/blue/course/parnter_class_add`, params)
}

// 获取合作方课程列表
export const getPartnerClassList = params => {
  return myGet(`${PHP_URL}/v5/blue/course/parnter_type_list`, params)
}

// 删除合作方
export const deletePartner = params => {
  return myPost(`${PHP_URL}/v5/blue/course/parnter_delete`, params)
}

// 删除合作方下课程 post
export const deletePartnerClass = params => {
  return myPost(`${PHP_URL}/v5/blue/course/parnter_class_delete`, params)
}

// 手动修改排序 post
export const setClassOrder = params => {
  return myPost(`${PHP_URL}/v5/blue/course/set_class_order`, params)
}

