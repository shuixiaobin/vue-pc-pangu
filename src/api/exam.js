import { myGet, myPost, myDelete, myPut } from './http'
import { Message, Loading } from 'element-ui'
import Vue from 'vue'

const vue = new Vue();

const OK_CODE = 10000
export const requestMethod = async (url, method, param = {}) => {
  let loadingIns;
  try {
    loadingIns = Loading.service()
    let res = await method(`${PHP_URL}${url}`, param)

    vue.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
      loadingIns.close();
    });

    if (res.code === OK_CODE) {
      return Promise.resolve(res.data)
    } else {
      Message(res.msg)
    }
  } catch (err) {
    vue.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
      loadingIns.close();
    });
    Message(err.msg)
  }
}

// php iframe
export let parentMsg = {}
// userName
Object.defineProperty(parentMsg, 'creater', {
  get: () => {
    return localStorage.getItem('userName')
      ? localStorage.getItem('userName')
      : '操作人'
  }
})
// userId
Object.defineProperty(parentMsg, 'createrId', {
  get: () => {
    return localStorage.getItem('userId')
      ? localStorage.getItem('userId')
      : '操作人'
  }
})


class Exam {
  // 获取所有考试类型
  getExamType() {
    return requestMethod('/v4/blue/class/cate_list', myGet)
  }

  // 获取考试类型课程列表
  getExamList(param) {
    return requestMethod('/v4/blue/class/cate_type', myGet, param)
  }

  // 获取下一页课程数据
  getSearchTabelList(param) {
    return requestMethod('/v4/blue/class/next_page', myGet, param)
  }

  // 设置类型标题
  setExamTypeTitle(param) {
    return requestMethod('/v4/blue/class/set_title', myPut, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // 类型排序
  setExamOrder(param) {
    return requestMethod('/v4/blue/class/set_type_order', myPut, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // app展示课程数量
  setAppClassNumber(param) {
    return requestMethod('/v4/blue/class/set_class_num', myPut, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // 课程排序
  setClassOrder(param) {
    return requestMethod('/v4/blue/class/set_class_order', myPut, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // 删除类型
  deleteExamType(param) {
    return requestMethod('/v4/blue/class/type', myDelete, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // 课程列表
  getClassList(param) {
    return requestMethod('/v4/blue/class/class_list', myGet, param)
  }

  // 合集列表
  getInterseList(param) {
    return requestMethod('/v4/blue/class/collect_list', myGet, param)
  }

  // 自动添加上下线合集
  getOnlineClassList(param) {
    return requestMethod('/v4/blue/class/auto_collect_list', myGet, param)
  }

  // 添加课程/合集
  setInterseOrClass(param) {
    return requestMethod('/v4/blue/class/add_class', myPut, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // 添加分类
  createClassType(param) {
    return requestMethod('/v4/blue/class/add_type', myPut, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // 获取分类图标
  getClassIcon(param) {
    return requestMethod('/v4/blue/class/img_list', myGet, param)
  }

  // 删除课程
  deleteClass(param) {
    return requestMethod('/v4/blue/class/class', myDelete, {
      ...param,
      creater: parentMsg.creater
    })
  }

  // 操作日志
  getOperateLog(param) {
    return requestMethod('/v4/blue/class/operate_log', myGet, param)
  }

  // 设置icon
  setIcon(param) {
    return requestMethod('/v4/blue/class/set_img', myPut, {
      ...param,
      creater: parentMsg.creater
    })
  }
}

export default new Exam()
