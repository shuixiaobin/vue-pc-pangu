import { myGet, myPost,myDelete } from './http'


export const getStudentInfo = (p) => myGet(`/interview/end/course/${p.courseId}`,p)

export const getSignInList = (params) => myGet('/interview/end/sign/list', params) // 查看签到记录列表

export const get_course_list = (p) => myGet(`${PHP_URL}/v5/blue/course/omo_class_list`,p)

export const saveStudentInfo = (p) => myPost(`/interview/end/course/updateUserRoleName`,p)

export const getTaskList = params => myGet('/interview/end/courseWork/list', params)

export const getCourseDetail = id => myGet(`/interview/end/courseWork/${id}`)

export const taskOperate = (id, data) => myPost(`/interview/end/courseWork/${id}`, data)

export const getAnswerList = (id, params) => myGet(`/interview/end/courseWork/answerList/${id}`, params)

export const getCourseWorkDetail = id => myGet(`/interview/end/courseWork/answer/${id}`)

export const getCorrectTemplate = () => myGet('/interview/end/courseWork/getEvaluations')

export const saveCorrect = (id, data) => myPost(`/interview/end/courseWork/answer/${id}`, data)

export const getReport = (courseId) => myGet(`/interview/end/course/enrollment/${courseId}`) //获取报道详情

export const saveReport = (params) => myPost(`/interview/end/course/enrollment/save`, params) //保存报道信息

export const exportReport = (params) => myGet('/interview/end/sign/download', params) // 导出签到数据

export const pushMsg = (data) => myPost(`/interview/end/course/push?courseId=${data.courseId}`, data)

export const batchCreateCourse = data => myPost('/interview/end/courseWork/batch', data)



export const classTempList = (params) => myGet('/interview/end/course/template/list', params) //模板作业列表

export const getTemplateList = (params) => myGet('/interview/end/courseWorkTemplate/list', params) //作业模板管理

export const delTemplate = (params) => myDelete(`/interview/end/courseWorkTemplate/delete/${params}`) //删除模板

export const categoryList = (params) => myGet('/interview/end/courseWorkTemplate/getCategory', params) //考试类型列表

export const saveTemplate = (data) => myPost(`/interview/end/courseWorkTemplate/save`, data)//保存模板

export const courseWorkList = (templateWorkId) => myGet(`/interview/end/v2/courseWork/list/${templateWorkId}`) //作业列表

export const omoAreaList = (param) => myGet(`${PHP_URL}/v5/blue/course/area_info`,param) //地区列表
export const totalTaskList = (params) => myGet('/interview/end/v3/courseWork/answerList', params) //作业批改列表

export const saveWork = (data) => myPost(`/interview/end/v2/courseWork/save`, data)//保存作业
export const delWorkTask = (params) => myDelete(`/interview/end/v2/courseWork/${params}`) //删除作业







