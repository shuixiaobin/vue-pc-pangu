import { myGet, myPost, myPost2, myGet1, ArrayBufferHandler } from './http'

export const getListQuery = (params) => myGet(`${CRM_URL}/crm/v1/channel/list`,params); //APP推广渠道管理-列表查询
export const postAddChannel = (params) => myPost(`${CRM_URL}/crm/v1/channel/save`,params); //APP推广渠道管理-新增渠道
export const getChannelList = (params) => myGet(`${CRM_URL}/crm/v1/channel/category/list`,params); //APP推广渠道管理-渠道分类列表
export const postAddChannelSort = (params) => myPost(`${CRM_URL}/crm/v1/channel/category/save`,params); //APP推广渠道管理-新增渠道分类
export const getDepartmentList = params => myGet(`${CRM_URL}/crm/v1/department/getDepartmentList`, params)
export const getPromoterUserList = params => myGet(`${CRM_URL}/crm/v1/promoter/user/getPromoterUserList`, params)
export const getPromoterChannelManageList = data => myPost(`${CRM_URL}/crm/v1/promoter/info/getPromoterChannelManageList`, data)
export const getWechatQRCode = params => myPost(`${BASEURL}/pand/wechat/mock/QrCode`, params, {noToken: true})
export const getPromoterNumeberList = params => myGet(`${CRM_URL}/crm/v1/promoter/user/getPromoterNumeberList`, params)
export const getTypeSubjectTree = () => myGet1(`${BASEURL}/pand/common/subject`, {noToken: true})
export const batchDownloadQRCode = data => myPost(`${CRM_URL}/crm/v1/promoter/info/batchDownloadQRCode`, data, { responseHandler: ArrayBufferHandler, responseType: 'arraybuffer', timeout: 60000 })
export const downloadStudentInfo = data => myPost(`${CRM_URL}/crm/v1/promoter/user/download`, data, { responseHandler: ArrayBufferHandler, responseType: 'arraybuffer' })
export const getMockEnrollList = data => myPost(`${CRM_URL}/crm/v1/promoter/info/getMockEnrollList`, data)


// 注册数据管理
export const getDataQuery = (params) => myGet(`${CRM_URL}/crm/v1/statistics/getRegistrationStatistics`,params); //注册数据管理-列表查询-用户注册统计


