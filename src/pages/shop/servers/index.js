import axios from 'axios';
import Vue from 'vue'

import { Message } from 'element-ui';
var instance = axios.create({
  baseURL: PHP_URL,
  timeout: 5000
});

instance.interceptors.request.use(
  config => {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      return config;
  },
  err => {
      return Promise.reject(err);
});

var _this = this
instance.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  if (error.response && error.response.status == 401) {
      let urlName = router.app.$route.name;
      router.push({ name: 'login', query: { redirectUrlName: urlName } });
    }
  if (error.response && error.response.code != 200)
    {
      Message.error("服务器错误")
     // return Promise.reject({ message: "请求超时" })
    }   
});

   

//推广地区列表
export function getArea() {
  return instance.get(`/fx/zx/get_dis_area`)
}

//考试类型
export function getExam() {
  return instance.get(`/fx/zx/get_item`)
}

//修改状态
export function changeStatus(params) {
  return instance.get(`/fx/zx/set_status`, { params })
}

//退款审核2
export function getListData(params) {
  return instance.get(`/fx/zx/get_dis_course_list`, { ...params })
}


//退款审核2
export function submit(params) {
  return axios.post(`${PHP_URL}/v5/c/class/rest_distribution`, { ...params })
}





