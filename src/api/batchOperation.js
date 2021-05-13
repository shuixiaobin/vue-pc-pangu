
import { myGet, myPost, myDelete, myPut } from './http';

import { requestMethod, parentMsg } from './exam'

class BatchOperation {
  // 搜索课程
  searchClass (params) {
    return requestMethod('/v4/pc/syllabus/search_class', myGet, params)
  }

  // 搜索试卷
  searchPaper (params) {
    return myGet('/pand/formativeTestPaper/list', params)
  }

  // 课程类型php接口
  getPHPTypes () {
    return requestMethod('/v5/pc/syllabus/exam_type', myGet)
  }

  // 课程类型java接口
  getTypes () {
    return myGet('/pand/formativeTestPaper/categoryInfo')
  }

  // 试卷状态
  getBizStatus () {
    return myGet('/pand/formativeTestPaper/activityState', { activityType: 18 })
  }

  // 课程是否有课件
  verifyCourseware (params) {
    return requestMethod('/v5/pc/syllabus/verify_courseware_in_syllabus', myGet, params)
  }

  // 批量关联
  insertStageTestBatch (params) {
    return requestMethod('/v5/pc/syllabus/insert_stage_test_batch', myPost, {...params, userId: parentMsg.createrId, userName: parentMsg.creater})
  }

  // 获取课件名称
  coursewareTitle (params) {
    return requestMethod('/v5/pc/syllabus/courseware_title', myGet, params)
  }

  // 检查是否存在
  verifyStageTestInSyllabus (params) {
    return requestMethod('/v5/pc/syllabus/verify_stage_test_in_syllabus', myGet, params)
  }

  // 批量删除
  stageTestBatchDel (params) {
    return requestMethod('/v5/pc/syllabus/stage_test_batch_del', myDelete, {...params, userId: parentMsg.createrId, userName: parentMsg.creater})
  }

  // 删除试题搜索
  searchPaperByCourseIds (params) {
    return requestMethod('/v5/pc/syllabus/stage_test_by_class_id', myGet, params)
  }

  // 批量关联课程
  relatedClassesBatch (params) {
    return requestMethod('/v5/pc/syllabus/related_classes_batch', myPost, {...params, userId: parentMsg.createrId, userName: parentMsg.creater})
  }

  // 根据类型查科目
  getSubjectInfo (params) {
    return myGet('/pand/formativeTestPaper/subjectInfo', params)
  }

  // 获取指定课程里的阶段节点信息
  getNodeInfo (params) {
    return requestMethod('/v5/pc/syllabus/stage_node_info_by_class_id', myGet, params)
  }

  // 批量添加阶段
  batchCreateStage (params) {
    return requestMethod('/v5/pc/syllabus/create_stage_name_batch', myPost, params)
  }
}

export default new BatchOperation
