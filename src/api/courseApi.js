import { myGet, myPost, myDelete, myPut } from './http';
import { requestMethod, parentMsg } from './exam'

function params_format(obj) {
  var str = "";
  for (var i in obj) {
    str += i + "=" + obj[i] + "&";
  }
  return str
    .split("")
    .slice(0, -1)
    .join("");
}

class Course {
  // 课程卡管理 php
  getCourseCard (params) {
    return requestMethod('/v5/blue/card/course_manage', myGet, params)
  }
  //删除课程卡
  deleteCourseCard (params) {
    return requestMethod('/v5/blue/card/delete_card', myPost, params)
  }

  //创建课程卡搜索课程
  searchCourse (params) {
    return requestMethod('/v5/blue/card/class_list', myGet, params)
  }

  //创建课程卡
  createCourseCard(params){
    return requestMethod('/v5/blue/card/create_card', myPost, {
      ...params,
      creator: parentMsg.creater
    })
  }

  //激活码列表
  getActivationList (params) {
    return requestMethod('/v5/blue/card/activation_management', myGet, params)
  }

  //获取适用范围
  getScopeList(params){
    return requestMethod('/v5/blue/card/scope_list', myGet, params)
  }

  //激活码失效
  invalidCode (params) {
    return requestMethod('/v5/blue/card/invalid', myPost, {
      ...params,
      operation: parentMsg.creater
    })
  }


  //导出激活码
  exportCode(param){
    let link = document.createElement("a");
    link.href = PHP_URL+`/v5/blue/card/excel_code?`+params_format(param);
    link.click();
    link = null;
  }

  //导出用户表
  exportUser(param){
    let link = document.createElement("a");
    link.href = PHP_URL+'/v5/blue/card/excel_activation_user?'+params_format(param);
    link.click();
    link = null;
  }

  //创建激活码
  createActivationCard(params){
    return requestMethod('/v5/blue/card/create_code', myPost, {
      ...params,
      creator: parentMsg.creater
    })
  }
  //查询线下课
  getCourse(param){
    return myPost(`${PHP_URL}/bm/c/snj/course_list`, param)
  }

  //查询 事业部及考试类型
  getExamType(param){
    return myGet(`${PHP_URL}/bm/c/snj/exam_type`)
  }
  //获取分部
  getFB(){
    return myGet(`${PHP_URL}/bm/c/snj/branch_department`)
  }
  //获取分校
  getSchool(){
    return myGet(`${PHP_URL}/bm/c/snj/branch_school`)
  }
  // 查询商品
  getGood(param){
    return myPost(`${PHP_URL}/bm/c/snj/goods_list`,param)
  }
  //获取在线考试类型
  getOnlineExamType(param){
      return requestMethod('/bm/c/class/exam_list',myGet,param)
  }
  //获取在线课程
  getOnlineCourse(param){
    return requestMethod('/bm/c/class/filter_class_list',myGet, param)
  }
  //创建O2O
  createO2O(param){
    return requestMethod('/v5/blue/course/ss_course_bind',myPost,{
      ...param,
      operator: parentMsg.creater
    })
  }
  //课程列表
  getO2OList(param){
    return myGet(`${PHP_URL}/v5/blue/course/ss_course_list`,param)
  }

  //考试类型列表
  getExamList(){
    return myGet(`${PHP_URL}/bm/c/class/exam_list`)
  }

  //考试类型列表
  getZhiboList(param){
      return myGet(`${PHP_URL}/v5/blue/lesson/live_room_statistics`,param)
  }
  //
  getZhiboOrder(param){
    return myGet(`${PHP_URL}/v5/blue/lesson/live_class_order`,param)
  }

  //设置上下线
  setClassStatus(param){
    return myPut(`${PHP_URL}/v5/blue/course/ss_course_status`, param)
  }

  //o2o课程回显
  getO2OData(param){
    return requestMethod('/v5/blue/course/ss_course_info',myGet,param)
  }



}

export default new Course()
