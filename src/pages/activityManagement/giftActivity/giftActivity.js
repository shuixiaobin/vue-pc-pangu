export default class GiftActivity {
  constructor (createUser) {
    return Object.assign(this, {
      activityName: '',
      startTime: '',
      endTime: '',
      validPeriodType: 'num',
      validPeriodNum: '',
      validPeriodTime: '',
      netClassArr: [],
      giftClassArr: [],
      createUser: createUser
    })
  }

  // 创建活动时 对象参数化
  static toParam (activity) {
    let paramObj = {
      activityName: activity.activityName,
      startTime: activity.startTime,
      endTime: activity.endTime,
      createUser: activity.createUser
    }
    // 根据用户选择确定 发送有效周期还是到期时间
    if (activity.validPeriodType === 'num') {
      paramObj.validPeriodNum = activity.validPeriodNum;
    } else {
      paramObj.validPeriodTime = activity.validPeriodTime;
    }
    // 课程数组过滤
    if (activity.netClassArr && Array.isArray(activity.netClassArr)) {
      paramObj.netClassArr = activity.netClassArr.map(item => {
        return {
          classId: item.classId,
          title: item.title,
          price: item.price,
          actualPrice: item.actualPrice
        }
      })
    }
    if (activity.giftClassArr && Array.isArray(activity.giftClassArr)) {
      paramObj.giftClassArr = activity.giftClassArr.map(item => {
        return {
          classId: item.classId,
          title: item.title,
          price: item.price,
          actualPrice: item.actualPrice
        }
      })
    }
    return paramObj
  }

  // 编辑活动时 对象参数化
  static toUpdateParam (activity) {
    let paramObj = {
      activityId: activity.activityId,
      activityName: activity.activityName,
      startTime: activity.startTime,
      endTime: activity.endTime
    }
    // 课程数组过滤
    if (activity.netClassArr && Array.isArray(activity.netClassArr)) {
      paramObj.netClassArr = activity.netClassArr.map(item => {
        return {
          classId: item.classId,
          title: item.title,
          price: item.price,
          actualPrice: item.actualPrice
        }
      })
    }
    if (activity.giftClassArr && Array.isArray(activity.giftClassArr)) {
      paramObj.giftClassArr = activity.giftClassArr.map(item => {
        return {
          classId: item.classId,
          title: item.title,
          price: item.price,
          actualPrice: item.actualPrice
        }
      })
    }
    return paramObj
  }

  // 组装活动详情数据 参数名与res.data 相同; user参数用来在复制时 更新创建人字段
  static makeupActivity ({zengActivityInfo, mainClasses, zengClasses}, user) {
    return {
      createUser: user,
      activityId: zengActivityInfo.programId,
      activityName: zengActivityInfo.activityName,
      startTime: zengActivityInfo.startTime,
      endTime: zengActivityInfo.endTime,
      validPeriodType: zengActivityInfo.validityDate ? 'num' : 'time',
      validPeriodNum: zengActivityInfo.validityDate,
      validPeriodTime: zengActivityInfo.validityTime,
      netClassArr: Object.freeze(mainClasses),
      giftClassArr: Object.freeze(zengClasses),
    }
  }
}