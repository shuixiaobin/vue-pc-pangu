import { myGet, myPost, myPost2 } from './http'

export const getOrderSelectOptions = (params) => myGet(`${PANGU_URL}/v1/c/order/selection`,params)
export const getBranchCityList = (params) => myGet(`${PANGU_URL}/v1/c/order/city_info_list`,params)
export const getFilesList = (params) => myGet(`${PANGU_URL}/v1/c/order/export_type`,params)
export const getOrderSingleList = (params) => myGet(`${PANGU_URL}/v1/c/order/list1`,params)
export const getOrderMultiList = (params) => myGet(`${PANGU_URL}/v1/c/order/list`,params)

export const getDictionaries = (params) => myGet(`${PANGU_URL}/v1/c/const/config`, params) //常用字典查询  字段：types 多个获取 逗号分隔 ,如 1,2,3 ka
export const getOrderList = (params) => myGet(`${PANGU_URL}/v1/c/order/order_service_list`, params) //请求订单列表字段
export const getOrderDetails = (params) => myGet(`${PANGU_URL}/v1/c/order/detail`, params)//订单详情页
export const getTurnRetreatOrder = (params) => myGet(`${PANGU_URL}/v1/c/order/turn_retreat_order`, params)//订单转、退、补提交页
export const postOrderSupplement = (params, header) => myPost2(`${PANGU_URL}/v1/c/order/order_supplement`, params, header)//订单退额操作提交下一步
export const postRefundUploadFile = (params) => myPost(`${PANGU_URL}/v1/c/order/upload`, params)//批量退额-上传文件
export const postOrderRefundDoplay = (params) => myPost(`${PANGU_URL}/v1/c/order/order_refund_doplay`, params)// 批量退额-批量导入

// =====   将来会移除这些方法
export const getServiceDetail = (params) => myGet(`${PANGU_URL}/v1/c/order/service_detail`, params)//订单提交服务
export const postServiceExit = (params) => myPost2(`${PANGU_URL}/v1/c/order/service_exit`, params)//退班提交
export const postServiceTurn = (params) => myPost2(`${PANGU_URL}/v1/c/order/service_turn`, params)//转班提交
export const postServiceRefund = (params) => myPost2(`${PANGU_URL}/v1/c/order/service_refund`, params)//退额提交
export const postServiceCompensate = (params) => myPost2(`${PANGU_URL}/v1/c/order/service_compensate`, params)//补额提交
// ======

export const getUserExit = (params) => myGet(`${PANGU_URL}/v1/c/order/user_is_exit`, params); //[代报名]获取用户信息
export const getAdminAccount = (params) => myGet(`${PANGU_URL}/v1/c/order/admin_account`, params); //[代报名]代报名用户余额
export const getClassList = (params) => myGet(`${PANGU_URL}/v1/c/class/class_list`, params); //0元赠送课程、代报名获取课程信息
export const postRegistClassOrder = (params) => myPost2(`${PANGU_URL}/v1/c/order/regist_class_order`, params);//[代报名]代报名
export const postZeroOrderDoplay = (params) => myPost2(`${PANGU_URL}/v1/c/order/zero_order_doplay`, params); //[代报名]0元赠送
export const postUploadFile = (params) => myPost2(`${PANGU_URL}/v1/c/order/upload`, params); //上传文件
export const postBatchGmatOnline = (params) => myPost2(`${PANGU_URL}/v1/c/order/import`, params); //批量代报名-在线
export const postBatchGmatFX = (params) => myPost2(`${PANGU_URL}/v1/c/order/branch_import`, params); //批量代报名-分校
export const postGmatBatchClosed = (params) => myPost2(`${PANGU_URL}/v1/c/order/agency_apply_do_batch_close`, params); //代报名批量关闭
export const postGmatClosed = (params) => myPost2(`${PANGU_URL}/v1/c/order/agency_apply_do_close`, params); //代报名关闭
export const getBranchSchoolList = (params) => myGet(`${PANGU_URL}/v1/c/class/class_branch_school`, params); //代报名-根据课程获取分校列表(双师)


export const getAuditOrderList = (params) => myGet(`${PANGU_URL}/v1/c/audit/list`, params) //订单审核列表
export const getAuditRequestRecord = (params) => myGet(`${PANGU_URL}/v1/c/orderauth/auth_log`,params)//订单审核日志
export const orderAudit = (params) =>myPost(`${PANGU_URL}/v1/c/orderauth/do_auth`,params) //订单审核操作
export const getBehalfAuditList = (params) => myGet(`${PANGU_URL}/v1/c/order/db_order_search`,params) //订单审核列表（代报名审核）
export const behalfReviewChange = (params) => myPost(`${PANGU_URL}/v1/c/order/review_change`,params)//订单审核列表（代报名审核-通过&驳回）
export const behalfReviewRevoke = (params) => myPost(`${PANGU_URL}/v1/c/order/signup_revoke`,params)

export const setBatchReject = params => myPost(`${PANGU_URL}/v1/c/audit/batch_apply_reject`, params)  //订单服务 - 服务列表-审核驳回(批量)
export const setReject = params => myPost(`${PANGU_URL}/v1/c/audit/apply_reject`, params)  //订单服务 - 服务列表-审核驳回
export const setOrderThrough = params => myPost(`${PANGU_URL}/v1/c/order/order_approved`, params) //补退额审核通过（批量）
export const getCheckLog = params => myGet(`${PANGU_URL}/v1/c/audit/apply_log`, params) //申请记录


// 订单服务-协议班服务
export const getProtoCourseList = params => myGet(`${PANGU_URL}/v1/c/schserver/course_list`, params)  //协议班服务-课程列表
export const getProtoCourseOrderList = params => myGet(`${PANGU_URL}/v1/c/schserver/course_order_list`, params)  //协议班服务-订单列表&搜索
export const getProtoOrderStatusAudit = params => myGet(`${PANGU_URL}/v1/c/schserver/order_status_audit`, params)  //协议班服务-订单确认审核&是否转结
export const getProtoOrderDetail = params => myGet(`${PANGU_URL}/v1/c/order/detail`, params)  //协议班服务-订单详情
export const getProtoSaveProtocolStudent = params => myGet(`${PANGU_URL}/v1/c/schserver/save_protocol_student`, params)  //协议班服务-修改协议客户信息
export const getProtoApplicationForm = params => myGet(`${PANGU_URL}/v1/c/schserver/application_form`, params)  //协议班服务-申请表
export const postProtoSupplementInformation = params => myPost(`${PANGU_URL}/v1/c/schserver/supplement_information`, params)  //协议班服务-修改补充信息
export const getProtoAgreementRefundInfo = params => myGet(`${PANGU_URL}/v1/c/schserver/agreement_refund_info`, params)  //协议班服务-协议退费
export const getProtoZipDownload = params => myGet(`${PANGU_URL}/v1/c/schserver/zip_download`, params)  //协议班服务-打包下载
export const getProtoUserInfo = params => myGet(`${PANGU_URL}/v1/c/schserver/protocol_user_info`, params)  //协议班服务-修改个人信息、补充信息，数据回显
export const postProtoPersonalInfomation = params => myPost(`${PANGU_URL}/v1/c/schserver/personal_information`, params)  //协议班服务-修改个人信息
export const getProtoProtocolUpload = params => myGet(`${PANGU_URL}/v1/c/schserver/protocol_upload`, params)  //协议班服务-订单详情-上传协议
export const getProtoPersonalSuppUnion = params => myGet(`${PANGU_URL}/v1/c/schserver/personal_supp_union`, params)  //协议班服务-联动修改补充信息



// 服务审核-协议班退费审核
export const getRefundList = params => myGet(`${PANGU_URL}/v1/c/audit/list`, params)
export const postRefundApproved = params => myPost(`${PANGU_URL}/v1/c/order/order_approved`, params) //通过
export const postTreatyRefund = params => myPost(`${PANGU_URL}/v1/c/order/treaty_refund`, params) //驳回
export const getRefundLog = params => myGet(`${PANGU_URL}/v1/c/audit/apply_log`, params) // 申请记录
export const getRefundTable = params => myGet(`${PANGU_URL}/v1/c/schserver/application_form`, params) // 申请表
export const getTableDownload = params => myGet(`${PANGU_URL}/v1/c/schserver/zip_download`, params) // 下载申请表