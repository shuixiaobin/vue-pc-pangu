import { makeCache } from '@/common/util'
import { myGet, myPost, myPost2 } from './http'

export const searchTeacher = (params) => myGet(`${PANGU_URL}/v1/c/teacher/search_teacher`, params) //模糊查询教师信息
export const getAccountInfo = (params) => myGet(`${PANGU_URL}/v1/c/teacher/account_info`, params) //查询账号信息
export const getTeacherList = (params) => myGet(`${PANGU_URL}/v1/c/teacher/new_teacher_list`, params) //教师列表
export const getSchoolList = makeCache((params) => myGet(`${PANGU_URL}/v1/c/commonselection/fen_xiao_selection`, params)) //获取所属学校列表
export const getCategory = makeCache((params) => myGet(`${PANGU_URL}/v1/c/commonselection/category_list`, params))//专长考试列表
export const getSubjectList = (params) => myGet(`${PANGU_URL}/v1/c/commonselection/subject_type_list`, params) //专长科目列表
export const setTeacher = (params) => myPost(`${PANGU_URL}/v1/c/teacher/create_or_update_teacher`, params) //新增或修改老师信息
export const setFenXiaoTeacher = (params) => myPost(`${PANGU_URL}/v1/c/teacher/fenxiao_create_or_update_teacher`, params) //新增或修改老师信息
export const getTeacherInfo = (params) => myGet(`${PANGU_URL}/v1/c/teacher/teacher_info`, params) //查询老师信息

export const getTeacherPhoneRegister = (params) => myGet(`${BASEURL}/uc/user/v2/register/teacherAccount`, params) //注册教师信息 手机号
export const postTeacherPhoneUpdate = (params) => myPost(`${BASEURL}/uc/user/v2/register/updateTeacherAccount`, params) //更新教师信息 手机号

export const updateTeacherInfo = (params) => myPost(`${PANGU_URL}/v1/c/teacher/update_teacher_status`, params) //更新老师状态
export const delTeacherInfo = (params) => myPost(`${PANGU_URL}/v1/c/teacher/del_teacher`, params) //删除老师
export const getTeacherLevel = makeCache((params) => myGet(`${PANGU_URL}/v1/c/commonselection/teacher_level`, params)) //教师级别
export const getSchoolType = makeCache((params) => myGet(`${PANGU_URL}/v1/c/commonselection/school_type`, params)) //分校列表
export const getExamTypeOne = (params) => myGet(`${PANGU_URL}/v1/c/commonselection/exam_type`, params) //获取组别/讲授科目 1级
export const getExamTypeTwo = (params) => myGet(`${PANGU_URL}/v1/c/commonselection/find_by_exam_type`, params) //获取组别/讲授科目 2级
export const getCourseLevel = makeCache((params) => myGet(`${PANGU_URL}/v1/c/commonselection/teacher_course_level`, params)) //教师授课等级



export const searchALLTeacher = (params) => myGet(`${PANGU_URL}/v1/c/teacher/all_teacher_list`,params) //所有授课老师查询
export const getLiveEvalList =  (params) => myGet(`${PANGU_URL}/v1/c/evaluate/schedule_evaluate_list`,params) //直播评价列表
export const getLiveEvalauteDetail = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/schedule_evaluate_detail`,params) //直播评价列表详情页
export const getTeacherEvalList = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/teacher_list`,params) //课程评价-老师评价
export const getTeacherCourseEvalList = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/evaluate_list_by_teacher_id`,params) //课程评价-老师评价-课程评价
export const changeTeacherCourseEvalIsWatch = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/change_status`,params) //课程评价-老师评价-课程评价-是否可见
export const getTeacherCourseList = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/course_list`,params) //课程评价-课程评价
export const getTeacherLessonList = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/lesson_list`,params) //课程评价-课程评价-课件评价
export const getTeacherEvaluateDetail = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/evaluate_detail`,params)//课程评价-课程评价-用户评价详情


export const checkAssistantPhone = (params) => myGet(`${PANGU_URL}/v1/c/assistant/check_phone`,params) //校验助教手机号
export const getAssistantTeacherType = (params) => myGet(`${PANGU_URL}/v1/c/assistant/assistant_type`,params) //获取老师考试类型
export const getAssistantList = (params) => myGet(`${PANGU_URL}/v1/c/assistant/assistant_list`,params) //助教列表
export const changeAssistantStatus = (params) => myPost2(`${PANGU_URL}/v1/c/assistant/update_assistant_status`,params) //更改助教状态
export const addAssistantTeacher = (params) => myPost2(`${PANGU_URL}/v1/c/assistant/change_assistant_info`,params) //新建修改助教信息
export const getAssistantTeacherInfo = (params) =>myGet(`${PANGU_URL}/v1/c/assistant/assistant_info`,params) //根据助教老师id获取助教详情


//教师服务
export const getMyClassTime = (params, header) => myGet(`${PANGU_URL}/v1/c/teacher/live_statistics`,params, header) //我的课时-查询
export const getMyClassTeacherId = (params) => myGet(`${PANGU_URL}/v1/c/teacher/teacher_id`,params) //我的课时-得到蓝色后台教师id
export const getMySchedule = (params, header) => myGet(`${PANGU_URL}/v1/c/assistant/my_curriculum`, params, header) //我的课表-查询
export const getScheduleList = (params) => myGet(`${PANGU_URL}/v1/c/schedule/schedule_list`, params) //我的课表-直播列表
export const getLiveEvaluateList = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/live_evaluate_list`, params) //我的课表-直播列表-评价详情
export const getLivePlayUrl = (params) => myGet(`${PANGU_URL}/v1/c/schedule/play_url`, params) //我的课表-直播列表-获取直播间地址
export const getMyEvaluateList = (params) => myGet(`${PANGU_URL}/v1/c/evaluate/my_evaluate_list`, params) //我的评价
export const getFindByUsername = (params) => myGet(`${PANGU_URL}/v1/c/teacher/find_by_user_name`, params) // 通过蓝色后台 userName 获取教师id

