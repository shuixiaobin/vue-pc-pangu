import { myGet, myPost } from './http'

/**
 * 督学中心
 */
// 协议模板
export const getTempList = payload => myGet(`${PANGU_URL}/v1/c/agreement/agreement_list`, payload)

export const tempPreview = param => myGet(`${PANGU_URL}/v1/c/agreement/agreement_info?templateId=${param}`)

export const tempStatus = params => myPost(`${PANGU_URL}/v1/c/agreement/agreement_status`, params)

// 协议参数
export const getParamList = params => myGet(`${PANGU_URL}/v1/c/agreement/protocol_parameter_list`, params)

export const getTempType = () => myGet(`${PANGU_URL}/v1/c/agreement/template_list`)

export const getExamTypeDec = () => myGet(`${PANGU_URL}/v1/c/agreement/cate_gory`)

export const editParamView = params => myGet(`${PANGU_URL}/v1/c/agreement/protocol_parameter_info?paramId=${params}`)

export const addEditParam = params => myPost(`${PANGU_URL}/v1/c/agreement/add_or_update_protocol_parameter`, params)

// 课程档案
export const getCourseArchivesList = params => myGet(`${PANGU_URL}/v1/c/netchart/course_archives_list`, params) //查询课程档案列表
export const postCoursePushSave = params => myPost(`${CRM_URL}/crm/v1/push/courseSave`, params) // 课程自定义push保存
export const getPushCourseList = params => myGet(`${CRM_URL}/crm/v1/push/getPushCourseList`, params) //课程自定义push历史列表
export const getStudentList = params => myGet(`${PANGU_URL}/v1/c/netchart/student_list`, params) //学员列表
export const postStudentOrderGroup = params => myPost(`${PANGU_URL}/v1/c/netchart/student_order_group`, params) //班主任群操作接口
export const getDataReportList = params => myGet(`${PANGU_URL}/v1/c/netchart/data_report_list`, params) //数据报表
export const getCourseTeacher = params => myGet(`${PANGU_URL}/v1/c/netchart/course_teacher`, params) //获取指定课程下的班主任




