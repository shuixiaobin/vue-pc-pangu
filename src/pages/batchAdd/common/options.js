import batchOperation from '@/api/batchOperation'
import { makeMap } from '../util'

export const getBizStatus = (function () {
  let data
  return function () {
    if (data) return data
    return batchOperation.getBizStatus().then(res => {
      data = res.data.map(item => ({ label: item.value, value: Number(item.key) }))
      return data
    })
  }
})();

export const getSubjectIds = (function () {
  let data
  return function () {
    if (data) return data
    return batchOperation.getTypes().then(res => {
      data = res.data.map(item => ({ label: item.value, value: item.key, key: item.key }))
      return data
    })
  }
})();

export const getPHPSubjectIds = (function () {
  let data
  return function () {
    if (data) return data
    return batchOperation.getPHPTypes().then(res => {
      data = res.list.map(item => ({ label: item.name, value: Number(item.cateId), key: item.javaCateId }))
      return data
    })
  }
})();

export const paperStatus = Object.freeze(
  [{
    label: '待审核',
    value: 0
  },{
    label: '已上线',
    value: 1
  },{
    label: '已下线',
    value: 2
  },{
    label: '已关闭',
    value: 3
  },{
    label: '全部',
    value: undefined
  }]
)

export const paperStatusMap = makeMap(paperStatus, 'value')
