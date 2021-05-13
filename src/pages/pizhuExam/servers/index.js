import axios from 'axios';
import Vue from 'vue'

import { Message } from 'element-ui';
var instance = axios.create({
  baseURL: BASEURL,
  timeout: 15000
});

instance.interceptors.request.use(
  config => {
      return config;
  },
  err => {
      return Promise.reject(err);
});


instance.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  if (error.response && error.response.status == 401) {
      let urlName = router.app.$route.name;
      router.push({ name: 'login', query: { redirectUrlName: urlName } });
    }
  if (error.response && error.response.code != 200)
    {
      Message.error(error.response.message)
     // return Promise.reject({ message: "请求超时" })
    }   
});

   

//试题类型列表
export function examTypeList() {
  return instance.get(`/e/end/essayQuestion/questionTypeList`)
}

//搜索条件枚举
export function searchList(params) {
  return instance.get(`/e/end/v1/courseExercise/searchType`,{ params })
}

//地区列表
export function areaList() {
  return instance.get(`/e/end/essayPaper/areaList`)
}

//未选择列表查询
export function unSelectedList(params) {
  return instance.get(`/e/end/v1/courseExercise/question/list`, { params })
}

//已选择列表查询
export function choosedList(params) {
  return instance.get(`/e/end/v1/courseExercise/selected/list`, { params })
}

//加入
export function join(params) {
  return instance.post(`/e/end/v1/courseExercise/save`, { ...params })
}

//编辑，上移下移
export function editList(params) {
  return instance.put(`/e/end/v1/courseExercise/edit`, [{ ...params }])
}

//删除
export function deleteItem(id) {
  return instance.delete(`/e/end/v1/courseExercise/${id}`)
}

//清除申论数据
export function clearItem(params) {
  return instance.post(`/e/end/v1/courseExercise/change/subject`, {...params})
}

//清除行测
export function deleteXc(id1,id2) {
  return instance.delete(`/pand/backend/courseExercises/changeSubject/${id1}/${id2}`)
}






