import Vue from 'vue'
import Router from 'vue-router'
// import oldRoute from './oldRoute.js'
import Home from '@/pages/home/Home'
import Login from '@/pages/home/Login'
import homePage from '@/pages/home/homePage'

//订单管理
import orderList from '@/pages/orderManagement/orderList/orderList'
import orderInfo from '@/pages/orderManagement/orderList/orderInfo'
import orderFrame from '@/pages/orderManagement/components/orderFrame' //订单三级框架
import withdrawAudit from '@/pages/orderManagement/serviceAudit/withdrawAudit' //订单服务-退班审核
import transferAudit from '@/pages/orderManagement/serviceAudit/transferAudit' //订单服务-转班审核
import refundAudit from '@/pages/orderManagement/serviceAudit/refundAudit' //订单服务-补退额审核
import behalfAudit from '@/pages/orderManagement/serviceAudit/behalfAudit' //订单服务-代报名审核
import portocolRefundAudit from '@/pages/orderManagement/serviceAudit/protocolClass/index' // 订单服务-协议班退费审核
import returnClassService from '@/pages/orderManagement/orderService/returnClassService/index'//订单服务-退班服务
import classTransferService from '@/pages/orderManagement/orderService/classTransferService/index'//订单服务-转班服务
import aftersalesService from '@/pages/orderManagement/orderService/aftersalesService/index'//订单服务-退补额服务
import replaceService from '@/pages/orderManagement/orderService/replaceService/index'//订单服务-代报名服务
import portocolClass from '@/pages/orderManagement/orderService/portocolClass/index' //订单服务-协议班服务
import portocolList from '@/pages/orderManagement/orderService/portocolClass/portocolList' //订单服务-协议班服务-订单列表


import detailsSubMitted from '@/pages/orderManagement/orderService/aftersalesService/detailsSubmitted' //退补额详情
import portocolSubMitted from '@/pages/orderManagement/orderService/portocolClass/detailsSubmitted' //退费详情
import batchRefundAmount from '@/pages/orderManagement/orderService/aftersalesService/batchRefundAmount'//批量退额
import submitApplications from '@/pages/orderManagement/orderService/components/index'
import orderDetails from '@/pages/orderManagement/orderService/components/orderDetails'
import returnClassCommit from '@/pages/orderManagement/orderService/components/returnClassCommit'
import classTransferCommit from '@/pages/orderManagement/orderService/components/classTransferCommit'
import refundAmountCommit from '@/pages/orderManagement/orderService/components/refundAmountCommit'
import fillForeheadCommit from '@/pages/orderManagement/orderService/components/fillForeheadCommit'
import submitSuccess from '@/pages/orderManagement/orderService/components/submitSuccess'

// 网图
import LabelManagement from '@/pages/netMap/LabelManagement'
import UserGroupManagement from '@/pages/netMap/userGroupManagement'
import StudentDetail from '@/pages/netMap/student/studentDetail/StudentDetail'
import UserList from '@/pages/netMap/student/userList'
import StudentList from '@/pages/netMap/student/studentList'
import UserGroupSetting from '@/pages/netMap/userGroupManagement/userGroupSetting'
import ADplan from '@/pages/netMap/ADplan'
import NotFound from '@/pages/errorPage/404'

//权限管理
import departmentList from '@/pages/authorityManagement/department/list'
import personnerList from '@/pages/authorityManagement/personnel/list'
import roleList from '@/pages/authorityManagement/role/list'
import editPower from '@/pages/authorityManagement/role/editPower'
import preview from '@/pages/authorityManagement/role/preview'
import AuthConfig from '@/pages/authorityManagement/authConfig/Index'

//教师服务
import myTimetable from '@/pages/teacherServer/myTimetable/index'
import liveList from '@/pages/teacherServer/myTimetable/liveList'
import myAppraise from '@/pages/teacherServer/myAppraise/index'
import myClass from '@/pages/teacherServer/myClass/index'


//数据中心
import appHannels from '@/pages/dataCenter/appHannelsManagement/wrap'
import dataManager from '@/pages/dataCenter/dataManager/index'

//教师管理
import teacherInfo from '@/pages/teacher/teacherInfo'
import teacherAdd from '@/pages/teacher/teacherInfo/teacherAdd'
import evaluation from '@/pages/teacher/evaluation'
import courseEvaluation from '@/pages/teacher/evaluation/courseEvaluation'
import liveEvaluation from '@/pages/teacher/evaluation/liveEvaluation'
import assistantInfo from '@/pages/teacher/assistantInfo/index'
import addAssistant from '@/pages/teacher/assistantInfo/add'

// 运营管理
import carouselList from '@/pages/operationManagement/carousel/index'
import carouselAdd from '@/pages/operationManagement/carousel/add'
// 活动管理
import ActivityFrame from '@/pages/activityManagement/Index'
// 直降
import PriceOffActivity from '@/pages/activityManagement/priceOffActivity/Index'
import PriceOffActivityAdd from '@/pages/activityManagement/priceOffActivity/ActivityAdd'
import PriceOffActivityView from '@/pages/activityManagement/priceOffActivity/ActivityView'
// 打折
import DiscountActivity from '@/pages/activityManagement/discountActivity/Index'
import DiscountActivityAdd from '@/pages/activityManagement/discountActivity/ActivityAdd'
import DiscountActivityView from '@/pages/activityManagement/discountActivity/ActivityView'
// 买赠
import GiftActivity from '@/pages/activityManagement/giftActivity/Index'
import GiftActivityAdd from '@/pages/activityManagement/giftActivity/ActivityAdd'
import GiftActivityView from '@/pages/activityManagement/giftActivity/ActivityView'
// AB优惠
import AbSaleActivity from '@/pages/activityManagement/abSaleActivity/Index'
import AbSaleActivityAdd from '@/pages/activityManagement/abSaleActivity/ActivityAdd'
import AbSaleActivityView from '@/pages/activityManagement/abSaleActivity/ActivityView'

/**
 * 督学中心
 */
import protocolTemplate from '@/pages/superintendentCenter/protocolTemplate.vue'
import protocolParameter from '@/pages/superintendentCenter/protocolParameter.vue'

import courseFiles from '@/pages/superintendentCenter/courseFiles/index.vue' // 课程档案
import studentTable from '@/pages/superintendentCenter/courseFiles/studentTable.vue' //课程档案-学员表
import studentPush from '@/pages/superintendentCenter/courseFiles/studentPush.vue' //课程档案-push

// 其他
// 小鹅通
import Xiaoetong from '@/pages/others/xiaoetong/Index.vue'

import GroupPurchaseView from '@/pages/groupPurchase/index'
import GroupPurchase from '@/pages/groupPurchase/groupPurchase'
import GroupPurchaseManagement from '@/pages/groupPurchase/groupPurchaseManagement'
import jobLibrary from '@/pages/jobLibrary/index'
import scanCode from '@/pages/scanCode/index'
import createCode from '@/pages/scanCode/createCode'
import policeScore from '@/pages/policeScore/scoreUpload'
Vue.use(Router)
export const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/homePage'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },

  {
    path: '/homePage',
    name: "homePage",
    component: Home,
    redirect: '/homePage/index',
    children: [
      {
        path: '/homePage/index',
        name: 'homePage',
        component: homePage,
        meta: {
          title: '首页'
        },
      },
    ]
  },
  {
    path: '/orderManagement',
    name: 'orderManagement',
    component: Home,
    redirect: '/orderManagement/orderList',
    meta: {
      title: '订单中心',
      icon: 'iconorder-outline',
    },
    children: [
      {
        path: '/orderManagement/orderList',
        name: 'orderList',
        component: orderList,
        meta: {
          title: '订单列表',
          keepAlive: true, //是否需要缓冲
          access: "ORDER_LIST"
        },
      },
      {
        path: '/orderManagement/orderInfo',
        name: 'orderInfo',
        component: orderInfo,
        hidden: true,
        meta: {
          title: '订单详情',
          activeMenu: 'orderList',
          requiresAuth: true
        },
      },
      {
        path: '/orderManagement/orderService',
        name: 'orderService',
        component: orderFrame,
        redirect: '/orderManagement/orderService/replaceService',
        meta: {
          title: '订单服务'
        },
        children: [
          //      {
          //        path: '/orderManagement/orderService/returnClassService',
          //        name: 'returnClassService',
          //        component: returnClassService,
          //        meta: {
          //          title: '退班服务',
          //          requiresAuth: true
          //        }
          //      },
          //      {
          //        path: '/orderManagement/orderService/returnClassService/:name',
          //        name: 'returnClassServiceInfo',
          //        component: submitApplications,
          //        hidden:true,
          //        meta:{
          //          title:'退班详情'
          //        },
          //      },
          //      {
          //        path: '/orderManagement/orderService/classTransferService',
          //        name: 'classTransferService',
          //        component: classTransferService,
          //        meta: {
          //          title: '转班服务',
          //          requiresAuth: true
          //        }
          //      },
          //      {
          //        path: '/orderManagement/orderService/classTransferService/:name',
          //        name: 'classTransferServiceInfo',
          //        component: submitApplications,
          //        hidden:true,
          //        meta:{
          //          title:'转班提交'
          //        },
          //      },
          {
            path: '/orderManagement/orderService/aftersalesService',
            name: 'aftersalesService',
            component: aftersalesService,
            meta: {
              title: '补退额服务',
              requiresAuth: true,
              access: "BTE_SERVER"
            },
          },
          {
            path: '/orderManagement/orderService/aftersalesService/batchSubmit',
            name: 'batchRefundAmount',
            component: batchRefundAmount,
            hidden: true,
            meta: {
              title: '批量退额',
              requiresAuth: true,
            }
          },
          {
            path: '/orderManagement/orderService/aftersalesService/submit',
            name: 'aftersalesServiceInfo',
            component: detailsSubMitted,
            meta: {
              title: '退补额详情'
            },
            hidden: true,
          },
          // {
          // 	path: '/orderManagement/orderService/aftersalesService/:name',
          // 	name: 'aftersalesServiceInfo',
          // 	component: submitApplications,
          // 	hidden: true,
          // },
          {
            path: '/orderManagement/orderService/replaceService',
            name: 'replaceService',
            component: replaceService,
            meta: {
              title: '代报名服务',
              access: "REPLACE_SIGN"
            },
          },
          {
            path: '/orderManagement/orderService/portocolClass',
            name: 'portocolClass',
            component: portocolClass,
            meta: {
              title: '协议班服务',
              requiresAuth: true,
              access: 'XYB_SERVER'
            },
          },
          {
            path: '/orderManagement/orderService/portocolClass/portocolList',
            name: 'portocolList',
            component: portocolList,
          },
          {
            path: '/orderManagement/orderService/portocolClass/submit',
            name: 'portocolSubMitted',
            component: portocolSubMitted,
            meta: {
              title: '退费提交'
            },
            hidden: true,
          },
        ]
      },
      {
        path: '/orderManagement/serviceAudit',
        name: 'serviceAudit',
        component: orderFrame,
        redirect: '/orderManagement/serviceAudit/behalfAudit',
        meta: {
          title: '服务审核'
        },
        children: [
          // {
          //   path: '/orderManagement/serviceAudit/withdrawAudit',
          //   name: 'withdrawAudit',
          //   component: withdrawAudit,
          //   meta: {
          //     title: '退班审核',
          //     requiresAuth: true
          //   }
          // },
          // {
          //   path: '/orderManagement/serviceAudit/transferAudit',
          //   name: 'transferAudit',
          //   component: transferAudit,
          //   meta: {
          //     title: '转班审核',
          //     requiresAuth: true
          //   }
          // },
          {
            path: '/orderManagement/serviceAudit/refundAudit',
            name: 'refundAudit',
            component: refundAudit,
            meta: {
              title: '退额审核',
              access: "BTE_SHENHE"
            }
          },
          {
            path: '/orderManagement/serviceAudit/behalfAudit',
            name: 'behalfAudit',
            component: behalfAudit,
            meta: {
              title: '代报名审核',
              access: "RS_SHENHE"
            }
          },
          {
            path: '/orderManagement/serviceAudit/portocolRefundAudit',
            name: 'portocolRefundAudit',
            component: portocolRefundAudit,
            meta: {
              title: '协议班退费审核',
              access: 'XYB_SHENHE'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/netMap',
    component: Home,
    name: 'netMap',
    redirect: '/netMap/studentList',
    meta: {
      title: '网图',
      icon: 'iconavatar-outline',
      requiresAuth: true
    },
    children: [
      {
        path: '/netMap/studentList',
        name: 'studentList',
        component: StudentList,
        meta: {
          title: '学员列表',
          access: "STUDENT_LIST"
        }
      },
      {
        path: '/netMap/studentDetail',
        name: 'studentDetail',
        component: StudentDetail,
        hidden: true,
        meta: {
          activeMenu: 'studentList',
          title: '用户全貌',
          requiresAuth: true
        },
      },
      {
        path: '/netMap/labelManagement',
        name: 'labelManagement',
        component: LabelManagement,
        meta: {
          title: '标签管理',
          access: "TAG_MANAGE",
        }
      },
      {
        path: '/netMap/userGroupManagement',
        name: 'userGroupManagement',
        component: UserGroupManagement,
        meta: {
          title: '用户分群管理',
          keepAlive: true, //是否需要缓冲
          access: "USER_FQ_MANAGE"
        }
      },
      {
        path: '/netMap/userGroupSetting',
        name: 'userGroupSetting',
        component: UserGroupSetting,
        hidden: true,
        meta: {
          title: '新建用户分群',
          activeMenu: 'userGroupManagement',
          requiresAuth: true
        },
      },
      {
        path: '/netMap/ADplan',
        name: 'ADplan',
        component: ADplan,
        meta: {
          title: '广告投放管理',
          access: "AD_CATE_PLAN"
        },
      },
    ]
  },

  // 运营管理
  {
    path: '/operationManagement',
    component: Home,
    name: 'operationManagement',
    redirect: '/operationManagement/carouselList',
    meta: {
      title: '运营中心',
      icon: 'el-icon-monitor'
    },
    children: [
      {
        path: '/operationManagement/carouselList',
        name: 'carouselList',
        component: carouselList,
        meta: {
          title: '首页轮播广告管理',
          access: "ADVERT",
          keepAlive: true
        }
      },
      {
        path: '/operationManagement/carouselAdd',
        name: 'carouselAdd',
        component: carouselAdd,
        hidden: true,
        meta: {
          activeMenu: 'carouselList',
          title: '首页轮播广告管理'
        }
      },
      {
        path: '/operationManagement/activityManagement',
        name: 'activityManagement',
        component: ActivityFrame,
        redirect: '/operationManagement/activityManagement/priceOff',
        meta: {
          title: '活动管理',
          // requiresAuth: true
        },
        children: [
          {
            path: '/operationManagement/activityManagement/priceOff',
            name: 'priceOffActivity',
            component: PriceOffActivity,
            meta: {
              title: '直降活动',
              access: 'PRICE_OFF_ACTIVITY'
            },
          },
          {
            path: '/operationManagement/activityManagement/priceOff/add',
            name: 'priceOffActivityAdd',
            component: PriceOffActivityAdd,
            meta: {
              title: '创建直降活动',
              activeMenu: 'priceOffActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/priceOff/edit/:activityId',
            name: 'priceOffActivityEdit',
            component: PriceOffActivityAdd,
            props: route => ({ type: 'edit', activityId: route.params.activityId }),
            meta: {
              title: '编辑直降活动',
              activeMenu: 'priceOffActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/priceOff/copy/:activityId',
            name: 'priceOffActivityCopy',
            component: PriceOffActivityAdd,
            props: route => ({ type: 'copy', activityId: route.params.activityId }),
            meta: {
              title: '复制直降活动',
              activeMenu: 'priceOffActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/priceOff/view/:activityId',
            name: 'priceOffActivityView',
            props: true,
            component: PriceOffActivityView,
            meta: {
              title: '查看直降活动',
              activeMenu: 'priceOffActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/discount',
            name: 'discountActivity',
            component: DiscountActivity,
            meta: {
              title: '打折活动',
              access: 'DISCOUNT_ACTIVITY'
            },
          },
          {
            path: '/operationManagement/activityManagement/discount/add',
            name: 'discountActivityAdd',
            component: DiscountActivityAdd,
            meta: {
              title: '创建打折活动',
              activeMenu: 'discountActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/discount/edit/:activityId',
            name: 'discountActivityEdit',
            component: DiscountActivityAdd,
            props: route => ({ type: 'edit', activityId: route.params.activityId }),
            meta: {
              title: '编辑打折活动',
              activeMenu: 'discountActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/discount/copy/:activityId',
            name: 'discountActivityCopy',
            component: DiscountActivityAdd,
            props: route => ({ type: 'copy', activityId: route.params.activityId }),
            meta: {
              title: '复制打折活动',
              activeMenu: 'discountActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/discount/view/:activityId',
            name: 'discountActivityView',
            props: true,
            component: DiscountActivityView,
            meta: {
              title: '查看打折活动',
              activeMenu: 'discountActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/gift',
            name: 'giftActivity',
            component: GiftActivity,
            meta: {
              title: '买赠活动',
              access: 'GIFT_ACTIVITY'
            },
          },
          {
            path: '/operationManagement/activityManagement/gift/add',
            name: 'giftActivityAdd',
            component: GiftActivityAdd,
            meta: {
              title: '创建买赠活动',
              activeMenu: 'giftActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/gift/edit/:activityId',
            name: 'giftActivityEdit',
            component: GiftActivityAdd,
            props: route => ({ type: 'edit', activityId: route.params.activityId }),
            meta: {
              title: '编辑买赠活动',
              activeMenu: 'giftActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/gift/copy/:activityId',
            name: 'giftActivityCopy',
            component: GiftActivityAdd,
            props: route => ({ type: 'copy', activityId: route.params.activityId }),
            meta: {
              title: '复制买赠活动',
              activeMenu: 'giftActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/gift/view/:activityId',
            name: 'giftActivityView',
            props: true,
            component: GiftActivityView,
            meta: {
              title: '查看买赠活动',
              activeMenu: 'giftActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/abSale',
            name: 'abSaleActivity',
            component: AbSaleActivity,
            meta: {
              title: 'AB优惠',
              access: 'AB_SALE_ACTIVITY'
            },
          },
          {
            path: '/operationManagement/activityManagement/abSale/add',
            name: 'abSaleActivityAdd',
            component: AbSaleActivityAdd,
            meta: {
              title: '创建AB优惠活动',
              activeMenu: 'abSaleActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/abSale/edit/:activityId',
            name: 'abSaleActivityEdit',
            component: AbSaleActivityAdd,
            props: route => ({ type: 'edit', activityId: route.params.activityId }),
            meta: {
              title: '编辑AB优惠活动',
              activeMenu: 'abSaleActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/abSale/copy/:activityId',
            name: 'abSaleActivityCopy',
            component: AbSaleActivityAdd,
            props: route => ({ type: 'copy', activityId: route.params.activityId }),
            meta: {
              title: '复制AB优惠活动',
              activeMenu: 'abSaleActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/abSale/view/:activityId',
            name: 'abSaleActivityView',
            props: true,
            component: AbSaleActivityView,
            meta: {
              title: '查看AB优惠活动',
              activeMenu: 'abSaleActivity',
              requiresAuth: true
            },
          },
          {
            path: '/operationManagement/activityManagement/groupPurchase',
            name: 'groupPurchase',
            component: GroupPurchase,
            meta: {
              keepAlive: true,
              title: '拼团活动',
              access: "PDD_HD"
            },
          },
          {//职位库
            path: '/operationManagement/activityManagement/jobLibrary',
            name: 'jobLibrary',
            component: jobLibrary,
            meta: {
              title: '小程序职位库管理',
              access: "JOB_LIB"
            }
          },
          {//二维码浏览
            path: '/operationManagement/activityManagement/scanCode',
            name: 'scanCode',
            component: scanCode,
            meta: {
              title: '微信二维码领取',
              access: "VX_CODE"
            }
          },
          {
            path: '/operationManagement/activityManagement/createCode',
            name: 'createCode',
            component: createCode
          },
          {//招警
            path: '/operationManagement/activityManagement/policeScore',
            name: 'policeScore',
            component: policeScore,
            meta: {
              title: '招警成绩管理',
              access: "POLICE_SCORE"
            }
          },
          {
            path: '/operationManagement/activityManagement/groupPurchaseManagement',
            name: 'groupPurchaseManagement',
            component: GroupPurchaseManagement,
            props: true
          }
        ]
      },
    ]
  },

  {
    path: '/teacher',
    component: Home,
    name: 'teacher',
    redirect: '/teacher/teacherInfo',
    meta: {
      title: '教师管理',
      icon: 'iconjiaoshiguanli',
      requiresAuth: true
    },
    children: [
      {
        path: '/teacher/teacherInfo',
        name: 'teacherInfo',
        component: teacherInfo,
        meta: {
          title: '教师信息',
          access: "TEACHER_INFO"
        }
      },
      {
        path: '/teacher/teacherAdd',
        name: 'teacherAdd',
        component: teacherAdd,
        hidden: true,
        meta: {
          title: '教师信息',
          activeMenu: 'teacherInfo',
          requiresAuth: true
        }
      },
      {
        path: '/teacher/evaluation',
        name: 'evaluation',
        component: evaluation,
        redirect: '/teacher/evaluation/liveEvaluation',
        meta: {
          title: '教师评价',
          requiresAuth: true
        },
        children: [
          {
            path: '/teacher/evaluation/liveEvaluation',
            name: 'liveEvaluation',
            component: liveEvaluation,
            meta: {
              title: '直播评价',
              access: "ZHIBO_PINGJIA"
            }
          },
          {
            path: '/teacher/evaluation/courseEvaluation',
            name: 'courseEvaluation',
            component: courseEvaluation,
            meta: {
              activeMenu: 'courseEvaluation',
              title: '课程评价',
              access: "CLASS_PINGJIA"
            }
          }
        ]
      },
      {
        path: '/teacher/assistantInfo',
        name: 'assistantInfo',
        component: assistantInfo,
        meta: {
          title: '助教信息',
          access: "ZHUJIAO_INFO"
        }
      },
      {
        path: '/teacher/addAssistant',
        name: 'addAssistant',
        component: addAssistant,
        hidden: true,
        meta: {
          title: '助教信息',
          activeMenu: 'assistantInfo',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/teacherServer',
    name: 'teacherServer',
    component: Home,
    redirect: '/teacherServer/myTimetable',
    meta: {
      title: '教师服务',
      icon: 'iconlaoshifuwu',
      requiresAuth: true
    },
    children: [
      {
        path: '/teacherServer/myTimetable',
        name: 'myTimetable',
        component: myTimetable,
        meta: {
          title: '我的课表',
          access: "MY_CLASS_LIST"
        },
      },
      {
        path: '/teacherServer/myTimetable/liveList',
        name: 'liveList',
        hidden: true,
        component: liveList,
        meta: {
          title: '直播列表',
          requiresAuth: true
        }
      },
      {
        path: '/teacherServer/myAppraise',
        name: 'myAppraise',
        component: myAppraise,
        meta: {
          title: '我的评价',
          access: "MY_PINGJIA"
        }
      },
      {
        path: '/teacherServer/myClass',
        name: 'myClass',
        component: myClass,
        meta: {
          title: '我的课时',
          access: "MY_CLASS_TIME"
        }
      },
    ]
  },

  {
    path: '/authorityManagement',
    component: Home,
    name: 'authorityManagement',
    redirect: '/authorityManagement/departmentList',
    meta: {
      title: '权限管理',
      icon: 'iconquanxianguanlibeifen',
      requiresAuth: true
    },
    children: [
      {
        path: '/authorityManagement/roleList',
        name: 'roleList',
        component: roleList,
        meta: {
          title: '角色管理',
          access: "ROLE_MANAGE"
        }
      },
      {
        path: '/authorityManagement/editPower',
        name: 'editPower',
        component: editPower,
        hidden: true,
        meta: {
          title: '编辑权限',
          requiresAuth: true
        }
      },
      {
        path: '/authorityManagement/preview',
        name: 'preview',
        component: preview,
        hidden: true,
        meta: {
          title: '预览权限',
          requiresAuth: true
        }
      },
      {
        path: '/authorityManagement/departmentList',
        name: 'departmentList',
        component: departmentList,
        meta: {
          title: '部门管理',
          access: "DEPART_MANAGE"
        }
      },
      {
        path: '/authorityManagement/personnerList',
        name: 'personnerList',
        component: personnerList,
        meta: {
          title: '人员管理',
          access: "PERSON_MANAGE"
        }
      },
      {
        path: '/authorityManagement/authConfig',
        name: 'authConfig',
        component: AuthConfig,
        meta: {
          title: '权限配置',
          access: 'AUTH_CONFIG'
        }
      }

    ]
  },

  {
    path: '/dataCenter',
    name: 'dataCenter',
    component: Home,
    meta: {
      title: '数据中心',
      icon: 'iconshujuzhongxin',
      requiresAuth: true
    },
    children: [
      {
        path: '/dataCenter/appHannels',
        name: 'appHannels',
        component: appHannels,
        meta: {
          title: 'APP推广渠道管理',
          access: "APP_AD_MANAGE",
        },
      },
			{
				path: '/dataCenter/dataManager',
				name: 'dataManager',
				component: dataManager,
				meta: {
					title: '注册数据管理',
					access: 'REGIST_DATA_MANAGER'
				}
			}
    ]
  },
  // 督学中心
  {
    path: '/superintendentCenter',
    name: 'superintendentCenter',
    component: Home,
    redirect: '/superintendentCenter/protocolTemplate',
    meta: {
      title: '督学中心',
      requiresAuth: true,
      icon: 'el-icon-odometer'
    },
    children: [
      {
        path: '/superintendentCenter/protocolTemplate',
        name: 'protocolTemplate',
        component: protocolTemplate,
        meta: {
          title: '协议模板',
          requiresAuth: true,
          access: 'PROTOCOL_TEMPLATE'
        }
      },
      {
        path: '/superintendentCenter/protocolParameter',
        name: 'protocolParameter',
        component: protocolParameter,
        meta: {
          title: '协议参数',
          requiresAuth: true,
          access: 'PROTOCOL_PARAMETER'
        }
      },
			{
				path: '/superintendentCenter/courseFiles',
				name: 'courseFiles',
				component: courseFiles,
				meta: {
					title: '课程档案',
					access: 'COURSE_FILES'
				}
			},
			{
				path: '/superintendentCenter/courseFiles/studentTable',
				name: 'studentTable',
				component: studentTable,
				meta: {
					title: '课程档案'
				}
			},
			{
				path: '/superintendentCenter/courseFiles/studentPush',
				name: 'studentPush',
				component: studentPush,
			}
    ]
  },
  {
    path: '/others',
    name: 'others',
    component: Home,
    redirect: '/others/xiaoetong',
    meta: {
      title: '其他',
      icon: 'iconbanzhurenfuwu',
      requiresAuth: true
    },
    children: [
      {
        path: '/others/xiaoetong',
        name: 'xiaoetong',
        component: Xiaoetong,
        meta: {
          title: '小鹅通课程绑定',
          access: 'XIAO_E_TONG'
        }
      }
    ]
  },


  // 提供给知小群的页面
  {
    path: '/userDetail',
    component: StudentDetail
  },
  {
    path: '/userList',
    name: 'userList',
    component: UserList
  },
  {
    path: '/404',
    name: 'Page404',
    component: NotFound,
  },
  {
    path: '*',
    redirect: '/404'
  }
]

export default routes
