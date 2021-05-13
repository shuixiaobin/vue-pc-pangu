
export default class DiscountActivity {
  
  constructor (optUsername) {
    return Object.assign(this, {
      activityName: '',
      startTime: '',
      endTime: '',
      showType: 0, // 已购人数显示设置：0显示实际购买人数，1每小时增加人数，2每增加一人参团，增加的人数
      addstep1: 0, // 每小时增加人数
      addstep2: 0, // 每增加一人参团，增加的人数
      optUsername: '', // 操作人
      netClassArr: [], // 课程列表
      optUsername: optUsername,
      // {
      //   classId: 课程Id,
      //   price: 实际价格,
      //   actualPrice: 活动价格,
      //   activityPrice: 活动价格,
      //   maxNum: 限购人数,
      //   point: 赠送积分,
      //   ratio: 折扣
      // }
    });
  }

  // 创建活动时 对象参数化
  static toParam (activity) {
    let paramObj = {
      Type: 2, // 活动类型 1:直降 2:打折
      activityName: activity.activityName,
      startTime: activity.startTime,
      endTime: activity.endTime,
      showType: activity.showType,
      optUsername: activity.optUsername,
      addstep1: parseInt(activity.addstep1) || 0,
      addstep2: parseInt(activity.addstep2) || 0,
    }
    // 课程数组过滤
    if (activity.netClassArr && Array.isArray(activity.netClassArr)) {
      paramObj.netClassArr = activity.netClassArr.map(item => {
        return {
          classId: item.classId,
          price: item.price,
          activityPrice: item.activityPrice,
          ratio: parseFloat(item.ratio),
          maxNum: item.maxNum,
          point: item.point
        }
      })
    }
    return paramObj
  }
  
  static toUpdateParam (activity) {
    let paramObj = {
      activityId: activity.activityId,
      activityName: activity.activityName,
      startTime: activity.startTime,
      endTime: activity.endTime,
      showType: activity.showType,
      addstep1: activity.addstep1 || 0,
      addstep2: activity.addstep2 || 0,
    }
    // 课程数组过滤
    if (activity.netClassArr && Array.isArray(activity.netClassArr)) {
      paramObj.netClassArr = activity.netClassArr.map(item => {
        return {
          classId: item.classId,
          price: item.price,
          activityPrice: item.activityPrice,
          ratio: parseFloat(item.ratio),
          maxNum: item.maxNum,
          point: item.point
        }
      })
    }
    return paramObj;
  }

  // 根据活动详情接口数据 生成活动对象
  static makeupActivity ({activity, netClass}, user) {
    let netClassArr = [];
    if (Array.isArray(netClass) && netClass.length) {
      netClassArr = netClass.map(item => {
        return {
          ...item,
          classId: item.NetClassId,
          classNo: item.ClassNo,
          title: item.Title,
          price: item.Price || 0,
          actualPrice: item.ActualPrice || 0,
          activityPrice: item.activityPrice || 0,
          maxNum: item.MaxNum,
          point: item.point,
          ratio: item.Ratio || 0,
          createDate: item.CreateDate,
          timestamp: item.LastUpdate
        }
      })
    }
    return Object.assign(new DiscountActivity(), {
      activityId: activity.rid,
      activityName: activity.Title,
      startTime: activity.StartTime,
      endTime: activity.EndTime,
      showType: activity.showType, // 已购人数显示设置：0显示实际购买人数，1每小时增加人数，2每增加一人参团，增加的人数
      addstep1: activity.addstep1, // 每小时增加人数
      addstep2: activity.addstep2, // 每增加一人参团，增加的人数
      optUsername: user || activity.optname, // 操作人
      netClassArr: netClassArr, // 课程列表
    })
  }
}
