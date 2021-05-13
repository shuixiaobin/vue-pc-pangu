import { myGet, myGet1, myPost } from './http'

export const getSubjectList = () => myGet1(`${BASEURL}/pand/common/subject`, { noToken: true })
export const getXinceActiveList = params => myGet(`${BASEURL}/pand/activityList/listForPhp`, params)
export const getShenlunActiveList = params => myGet(`${BASEURL}/e/end/mock/listForPhp`, params)

export const getAreaList = params => myGet(`${BASEURL}/pand/paper/activity/area`, params)
export const addExam = data => myPost(`${PHP_URL}/v5/blue/course/mock_exam`, undefined, {params: data})
export const getExam = params => myGet(`${PHP_URL}/v5/blue/course/mock_exam_info`, params)
export const getXingceDetail = params => myGet(`${BASEURL}/pand/activityList/detailForPhp`, params)
export const getShenlunDetail = params => myGet(`${BASEURL}/e/end/mock/detailForPhp`, params)

export function getActiveList (type, data) {
  if (type === 0) {
    // 行测
    return getXinceActiveList(data).then(res => res.data)
  } else {
    return getShenlunActiveList(data).then(res => {
      return {
        total: res.data.total,
        list: res.data.result
      }
    })
  }
}

export function getExamDetail (subject, params) {
  if (subject != 14) {
    return getXingceDetail(params).then(res => res.data)
  } else {
    return getShenlunDetail(params).then(res => res.data)
  }
}
