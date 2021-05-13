export default class AbSaleActivity {
  constructor(optUsername) {
    return Object.assign(this, {
      classA: null, // A课程
      classB: null, // B课程
      abActivityType: null, // 活动类型(1.打折 2.直降)
      startTime: '',
      endTime: '',
      optUsername: optUsername, // 操作人
      sale: 0, // 打折或直降金额
      activityPrice: '', // 活动价格
    });
  }

  // 创建活动时 对象参数化
  static toParam(activity) {
    let sale = parseFloat(activity.sale);
    if (activity.abActivityType == 1) {
      // js小数精度处理
      sale = parseFloat((sale / 10).toFixed(2));
    }
    return {
      classA: activity.classA.classId,
      classB: activity.classB.classId,
      abActivityType: activity.abActivityType, // 活动类型(1.打折 2.直降)
      activityTime: activity.startTime + ' - ' + activity.endTime, // 活动时间 eg:2021-02-18 00:00:00 - 2021-02-18 23:59:59
      optUsername: activity.optUsername, // 操作人
      sale: sale, // 打折或直降金额
    };
  }

  // 编辑活动时
  static toUpdateParam(activity) {
    let paramObj = AbSaleActivity.toParam(activity);
    paramObj.activityId = activity.activityId;
    return paramObj;
  }

  // 根据活动详情接口数据 生成活动对象
  static makeupActivity(activity, user) {
    let classA = {
      ...activity.classA,
      classId: activity.classA.rid
    };
    let classB = {
      ...activity.classB,
      classId: activity.classB.rid
    };
    return Object.assign(new AbSaleActivity(), {
      activityId: activity.id,
      classA: classA, // A课程
      classB: classB, // B课程
      activityPrice: activity.classB.activityPrice,
      abActivityType: activity.type, // 活动类型(1.打折 2.直降)
      // activityTime: activity.beginDate + ' - ' + activity.endDate, // 活动时间
      startTime: activity.beginDate,
      endTime: activity.endDate,
      createDate: activity.createDate,
      status: activity.status,
      optUsername: user || activity.optName, // 操作人
      sale: activity.sale // 打折或直降金额
    });
  }
}
