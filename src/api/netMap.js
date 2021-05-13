import { myGet, myGet1, myPost, myPost2 } from './http'
import store from '../store'

export const getStudentList = (params) => myGet(`${PANGU_URL}/v1/c/student/student_detail`, params) //获取学员列表
export const getStudentInfo = (params) => myGet(`${PANGU_URL}/v1/c/student/student_info`, params) //获取学员信息
export const getStudentStudyInfo = (params) => myGet1('/pand/wangtu/getUserStatistics', { params, noToken: true }) //获取学员学习情况
export const getExamData = (params) => myGet('/p/v1/user/exam/profile', params) //获取学员其他信息
export const getStudentOrderList = (params) => myGet(`${PANGU_URL}/v1/c/student/order_list`, params) //获取订单列表
export const getAddressList = (params) => myGet(`${PANGU_URL}/v1/c/student/address_list`, params) //获取收获地址列表
export const getFollowRecordList = params => myGet(`${PANGU_URL}/v1/c/student/consultation_record`, params) //获取跟进记录列表
export const getFollowRecordOptionList = params => myGet(`${PANGU_URL}/v1/c/student/option_list`, params) //获取咨询记录选项列表
export const addFollowRecord = params => myPost(`${PANGU_URL}/v1/c/student/consultation`, params) //添加咨询记录
export const bindUser = params => myPost(`${PANGU_URL}/v1/c/student/bind_user`, params) //多用户选择绑定
export const getsuperintendentList = params => myGet(`${PANGU_URL}/v1/c/netchart/superintendent_list`, params) //督学列表
export const getPeriodTestList = params => myGet(`${CRM_URL}/crm/v1/periodTest/getPeriodTestList`, params) //督学列表

export const getLabelList = (params) => myGet(`${PANGU_URL}/v1/c/tag/tag_tree`, params) //标签列表获取
export const setLabel = (params) => myPost(`${PANGU_URL}/v1/c/tag/update_or_create_tag`, params) //标签新建/修改
export const getCategory = () => myGet(`${PANGU_URL}/v1/c/class/category_list`) //获取考试类型
export const delLabel = (params) => myPost(`${PANGU_URL}/v1/c/tag/del_tag`, params) //删除标签组

export const login = params => myPost(`${PANGU_URL}/auth/login`, params) //登陆

export const userGroupFormula = params => myGet(`${PANGU_URL}/v1/c/usergroup/formula`,params)
export const userGroupList = params => myGet(`${PANGU_URL}/v1/c/usergroup/list`,params) //用户分群列表
export const delUserGroupList = params => myGet(`${PANGU_URL}/v1/c/usergroup/delete`,params) //分群列表删除
export const saveUserGroup = params => myPost(`${PANGU_URL}/v1/c/usergroup/save`,params) //保存分群
export const getUserGroupDetail = params => myGet(`${PANGU_URL}/v1/c/usergroup/detail`,params) //分群详情
export const remoteSearch = params => myPost(`${PANGU_URL}/v1/c/usergroup/search`,params) //远程搜索

export const getUserList = params => myGet(`${CRM_URL}/crm/advert/plan/accountList`, params,{ userId: store.state.oaUserId }) //获取推广账号下拉列表
export const getAdPlanList = params => myGet(`${CRM_URL}/crm/advert/plan/v2/list`, params,{ userId: store.state.oaUserId }) //获取广告线索分配计划列表
export const getRobotList = params => myGet(`${CRM_URL}/crm/group/robot/list`, params,{ userId: store.state.oaUserId }) //获取机器人列表
export const setPassiveBindRobot = params => myPost2(`${CRM_URL}/crm/group/robot/passive/robot/save`, params,{ userId: store.state.oaUserId }) // 被动计划-绑定机器人
export const getPassiveBindRobot = promoteCampaignId => myGet(`${CRM_URL}/crm/group/robot/bind/list/${promoteCampaignId}`,{}, { userId: store.state.oaUserId }) //被动计划-回显
export const setActiveBindRobot = params => myPost2(`${CRM_URL}/crm/active/batch/save`, params,{ userId: store.state.oaUserId }) //主动计划-添加机器人
export const getActivePlanList = campaignId => myGet(`${CRM_URL}/crm/active/batch/bind/list/${campaignId}`,{ userId: store.state.oaUserId }) // 主动计划列表
export const getActivePlanDetail = (campaignId) => myGet(`${CRM_URL}/crm/active/batch/${campaignId}`, {}, { userId: store.state.oaUserId }) //主动计划查看
export const getFlowList = (params) => myGet(`${CRM_URL}/crm/group/robot/drainage/list`, params,{ userId: store.state.oaUserId }) // 机器人流量漏斗查询
export const getDataActiveTotal = (campaignId) => myGet(`${CRM_URL}/crm/active/batch/total/count/${campaignId}`, {},{ userId: store.state.oaUserId }) //数据-主动 第一行的总统计
export const getDataActive = (campaignId) => myGet(`${CRM_URL}/crm/active/batch/total/list/${campaignId}`, {},{ userId: store.state.oaUserId }) //数据-主动 机器人列表
export const setUpload = (file) => myPost(`${CRM_URL}/crm/upload/image`, file) //上传文件接口
export const getToken = (userId) => myPost2(`/u/v1/users/getTokenByUid?userId=${userId}`, {}, { authToken: '2885a9c94ca445cdadce1866131f10b6' }) //用户全貌模考跳转报告页面
export const PlanExport = params => myGet(`${CRM_URL}/crm/excel/list/download`, params,{ responseType: 'blob', userId: store.state.oaUserId }) //计划导出
export const planInfoDetail = params => myGet(`${CRM_URL}/crm/v1/cluster/plan/infoDetail`, params)//加群计划配置详情
export const planInfoSave = params => myPost2(`${CRM_URL}/crm/v1/cluster/plan/save`, params)//加群计划配置保存
export const wangtuReport = params => myGet(`${CRM_URL}/crm/v2/wangtu/report`, params)//课程计划看板
export const getCourseName = params => myGet(`${CRM_URL}/crm/v1/cluster/plan/getCourseName`, params)//获取课程名称


// 用户全貌 编辑用户标签
export const saveUserTag = params => myPost(`${PANGU_URL}/v1/c/student/student_tag_edit`,params)
// 用户全貌  事件标签列表
export const getEventTag = params => myGet(`${PANGU_URL}/v1/c/student/event_tag`,params)