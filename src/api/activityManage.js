import { myGet, myPut, myPost, myPost2, } from './http'

// priceOff 直降活动
export const getPriceOffActivityList = (params) => myGet(`${PANGU_URL}/v1/c/reduction/activity/list`, params) // 活动列表
export const setPriceOffActivityOnline = (params) => myPut(`${PANGU_URL}/v1/c/reduction/activity/online`, params) // 活动上线
export const setPriceOffActivityOffline = (params) => myPut(`${PANGU_URL}/v1/c/reduction/activity/offline`, params) // 活动下线
export const delPriceOffActivity = (params) => myPut(`${PANGU_URL}/v1/c/reduction/activity/delete`, params) // 活动删除
export const delPriceOffActivityBatch = (params) => myPut(`${PANGU_URL}/v1/c/reduction/activity/batch_delete`, params) // 活动批量删除
export const getPriceOffActivityClassList = (params) => myGet(`${PANGU_URL}/v1/c/reduction/activity/filter_class_list`, params) // 筛选活动主课和赠课
export const postPriceOffActivity = (params) => myPost(`${PANGU_URL}/v1/c/reduction/activity/create`, params) // 创建活动
export const getPriceOffActivityDetail = (params) => myGet(`${PANGU_URL}/v1/c/reduction/activity/detail`, params) // 获取活动详情
export const setPriceOffActivityUpdate = (params) => myPut(`${PANGU_URL}/v1/c/reduction/activity/update`, params) // 修改活动

// discount 打折活动
export const getDiscountActivityList = (params) => myGet(`${PANGU_URL}/v1/c/discount/activity/list`, params) // 活动列表
export const setDiscountActivityOnline = (params) => myPut(`${PANGU_URL}/v1/c/discount/activity/online`, params) // 活动上线
export const setDiscountActivityOffline = (params) => myPut(`${PANGU_URL}/v1/c/discount/activity/offline`, params) // 活动下线
export const delDiscountActivity = (params) => myPut(`${PANGU_URL}/v1/c/discount/activity/delete`, params) // 活动删除
export const delDiscountActivityBatch = (params) => myPut(`${PANGU_URL}/v1/c/discount/activity/batch_delete`, params) // 活动批量删除
export const getDiscountActivityClassList = (params) => myGet(`${PANGU_URL}/v1/c/discount/activity/filter_class_list`, params) // 筛选活动主课和赠课
export const postDiscountActivity = (params) => myPost(`${PANGU_URL}/v1/c/discount/activity/create`, params) // 创建活动
export const getDiscountActivityDetail = (params) => myGet(`${PANGU_URL}/v1/c/discount/activity/detail`, params) // 获取活动详情
export const setDiscountActivityUpdate = (params) => myPut(`${PANGU_URL}/v1/c/discount/activity/update`, params) // 修改活动

// gift 买赠活动
export const getGiftActivityList = (params) => myGet(`${PANGU_URL}/v1/c/zeng/activity/list`, params) // 活动列表
export const setGiftActivityOnline = (params) => myPut(`${PANGU_URL}/v1/c/zeng/activity/online`, params) // 活动上线
export const setGiftActivityOffline = (params) => myPut(`${PANGU_URL}/v1/c/zeng/activity/offline`, params) // 活动下线
export const delGiftActivity = (params) => myPut(`${PANGU_URL}/v1/c/zeng/activity/delete`, params) // 活动删除
export const delGiftActivityBatch = (params) => myPut(`${PANGU_URL}/v1/c/zeng/activity/batch_delete`, params) // 活动批量删除
export const getGiftActivityClassList = (params) => myGet(`${PANGU_URL}/v1/c/zeng/activity/filter_class_list`, params) // 筛选活动主课和赠课
export const postGiftActivity = (params) => myPost(`${PANGU_URL}/v1/c/zeng/activity/create`, params) // 创建买赠活动
export const getGiftActivityDetail = (params) => myGet(`${PANGU_URL}/v1/c/zeng/activity/detail`, params) // 获取活动详情
export const setGiftActivityUpdate = (params) => myPut(`${PANGU_URL}/v1/c/zeng/activity/update`, params) // 修改买赠活动

// abSale ab优惠
export const getAbSaleActivityList = (params) => myGet(`${PANGU_URL}/v1/c/Ab/activity/list`, params) // 活动列表
export const setAbSaleActivityOnline = (params) => myPut(`${PANGU_URL}/v1/c/Ab/activity/online`, params) // 活动上线
export const setAbSaleActivityOffline = (params) => myPut(`${PANGU_URL}/v1/c/Ab/activity/offline`, params) // 活动下线
export const delAbSaleActivity = (params) => myPut(`${PANGU_URL}/v1/c/Ab/activity/delete`, params) // 活动删除
export const delAbSaleActivityBatch = (params) => myPut(`${PANGU_URL}/v1/c/Ab/activity/batch_delete`, params) // 活动批量删除
export const getAbSaleActivityClassList = (params) => myGet(`${PANGU_URL}/v1/c/Ab/activity/filter_class_list`, params) // 筛选活动主课和赠课
export const postAbSaleActivity = (params) => myPost(`${PANGU_URL}/v1/c/Ab/activity/create`, params) // 创建活动
export const getAbSaleActivityDetail = (params) => myGet(`${PANGU_URL}/v1/c/Ab/activity/detail`, params) // 获取活动详情
export const setAbSaleActivityUpdate = (params) => myPut(`${PANGU_URL}/v1/c/Ab/activity/update`, params) // 修改活动
export const setAbSaleActivityDownload = (params) => myGet(`${PANGU_URL}/v1/c/Ab/activity/download`, params) // 批量模板下载
export const setAbSaleActivityImport = (params) => myPost(`${PANGU_URL}/v1/c/Ab/activity/template_imports`, params) // 活动模板导入

export const postUploadFile = (params) => myPost(`${PANGU_URL}/v1/c/order/upload`, params)//批量退额-上传文件
