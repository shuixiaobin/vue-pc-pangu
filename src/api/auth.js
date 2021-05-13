import { myGet, myPost, myPost2, myDelete,myPut } from './http';

export const loginIn = params =>myPost(`${BASEURL}/uc/auth/v2/login`,params)
export const codeIn = params =>myPost(`${BASEURL}/uc/auth/v2/login`,params)
export const getPhoneCode = params =>myGet(`${BASEURL}/uc/auth/v2/captcha/${params}`)
export const resetPwd = params =>myPost(`${BASEURL}/uc/auth/v2/resetPassword`,params)
export const forgetPwd = params =>myPost(`${BASEURL}/uc/auth/v2/forgetPassword?mobile=${params.mobile}&captcha=${params.captcha}`)

export const getAuthInfo = params =>myGet(`${BASEURL}/uc/menu/v2/navigation?systemId=${params}`)
export const getOtherToken = params =>myPost(`${BASEURL}/uc/auth/v2/systemSkip?systemId=${params}`)
export const getCollection = params =>myGet(`${BASEURL}/uc/menu/v2/collection?systemId=${params}`)
export const cancelCollet = params =>myDelete(`${BASEURL}/uc/menu/v2/collection?menuId=${params}`)
export const collectIn = params =>myPost(`${BASEURL}/uc/menu/v2/collection?menuId=${params}`)

export const getTzNum = params =>myGet(`${PANGU_URL}/v1/c/notification/group?userName=${params}`)
export const getIsOuterNet = ()=>myGet(`${BASEURL}/uc/auth/v2/getIpAddress`)


export const getFindMenu = params =>myGet(`${BASEURL}/uc/menu/v2/search?systemId=${params.systemId}&keyWord=${params.keyWord}`)

// 首页接口
export const getNoticeList = params => myGet(`${PANGU_URL}/v1/c/notification/list`, params)
export const getNoticeDetail = params => myGet(`${PANGU_URL}/v1/c/notification/detail`, params)
export const setRead = params => myPost(`${PANGU_URL}/v1/c/notification/set_read`, params)

//收藏排序
export const setSort = params => myPost(`${BASEURL}/uc/menu/v2/collectionOrder?menuIds=${params}`)











