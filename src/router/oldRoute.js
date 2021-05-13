/* 
  这是蓝色后台迁移过来的菜单
*/
import Home from '@/pages/home/Home'
import relevanceExercises from '@/pages/relevanceExercises/RelevanceExercises'
import practiceOnClass from '@/pages/practiceClass/player'
import classRelevance from '@/pages/classRelevance/classRelevance'
import spellGroup from '@/pages/spellGroup/spellGroup'
import addList from '@/pages/addList/list'
import addredlist from '@/pages/redPackets/list/index'
import addred from '@/pages/redPackets/addEdit/index'
import examType from '@/pages/examType/index'
import batchAddCourse from '@/pages/batchAdd/index'
import batchAddChoices from '@/pages/batchAdd/choices'
import twoLevels from '@/pages/batchAdd/twoLevels/index'
import threeLevels from '@/pages/batchAdd/threeLevels/index'
import stageTest from '@/pages/batchAdd/stageTest/index'
import stageTestDel from '@/pages/batchAdd/stageTestDel/index'
import htShop from '@/pages/shop/index'
import bookList from '@/pages/book/bookList'
import addBook from '@/pages/book/addBook'
import setSheet from '@/pages/book/setSheet'
import bookDetail from '@/pages/book/bookDetail'
import typeChoose from '@/pages/pizhuExam/index'
import courseCardMan from '@/pages/courseCardMan/index'
import createCourseCard from '@/pages/courseCardMan/createCourseCard'
import activationCode from '@/pages/courseCardMan/activationCode'
import o2o from '@/pages/o2o/index'
import o2oCreate from '@/pages/o2o/create'
import o2oDetail from '@/pages/o2o/detail'
import thirdParty from '@/pages/thirdParty/index'
import Qrcode from '@/pages/qrCode/index'



import AddExam from '@/pages/addExam/addExam'
import dataClean from '@/pages/dataClean/dataClean'
import liveShop from '@/pages/liveShop/index'

import OMOLIST from '@/pages/omo/list'
import OMODetail from '@/pages/omo/detail'
import OMOstudent from '@/pages/omo/student'
import OMOtask from '@/pages/omo/task'
import OMOreport from '@/pages/omo/report'
import OMOeditReport from '@/pages/omo/EditReport'
import OMOsignIn from '@/pages/omo/signIn'
import OMOapproval from '@/pages/omo/approval'

import OMOhomework from '@/pages/omo/homeworkTemplateManage'
import OMOhomeworkList from '@/pages/omo/homeworkList'
import OMOtemplate from '@/pages/omo/templateTask'
import tempalteList from '@/pages/omo/tempalteTask/tempList'
import tempalteTaskList from '@/pages/omo/tempalteTask/taskList'
import homeWorkListTotal from '@/pages/omo/homeWorkListTotal'


import userProxyList from '@/pages/userProxyList/userProxyList'


export default [
  
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/htShop',
    meta: {
      hideInMenu: true // true ==>不在左菜单展示
    },
    children: [
      {
        path: '/home/liveShop',
        name: 'liveShop',
        component: liveShop
      },
      {
        path: '/home/relevanceExercises',
        name: 'relevanceExercises',
        component: relevanceExercises
      },
      {
        path: '/home/practice',
        name: 'practice',
        component: practiceOnClass
      },
      {
        path: '/home/classRelevance',
        name: 'classRelevance',
        component: classRelevance
      },
      {
        path: '/home/spellGroup',
        name: 'spellGroup',
        component: spellGroup
      },
      {
        path: '/home/list',
        name: 'list',
        component: addList
      },
      {
        path: '/home/redlist',
        name: 'redlist',
        component: addredlist
      },
      {
        path: '/home/addred',
        name: 'addred',
        component: addred
      },
      {
        path: '/home/examType',
        name: 'examType',
        component: examType
      },
      {
        path: '/home/htShop',
        name: 'htShop',
        component: htShop
      },
      {
        path: '/home/typeChoose',
        name: 'typeChoose',
        component: typeChoose
      },

      {
        path: '/home/batchAdd',
        component: batchAddCourse,
        name: 'batchAdd',
        redirect: '/home/batchAdd/',
        meta: {
          breadcrumb: '网络课程批量处理',
          title: '课程大纲批量添加'
        },
        children: [
          {
            path: '',
            name: 'batchAddChoices',
            component: batchAddChoices,
            meta: {
              title: '课程大纲批量添加'
            }
          },
          {
            path: 'twoLevels',
            name: 'twoLevels',
            component: twoLevels,
            meta: {
              title: '课程大纲批量添加'
            }
          },
          {
            path: 'threeLevels',
            name: 'threeLevels',
            component: threeLevels,
            meta: {
              title: '课程大纲批量添加'
            }
          }
        ]
      },
      /* 👇👇OMO线下班 👇👇*/
      {
        path: '/OMO',
        redirect: '/home/OMO',
      },
      {
        path: '/home/OMO',
        name: 'OMOLIST',
        component: OMOLIST
      },
      {
        path: '/home/OMO/OMOHomework',
        name: 'OMOHomework',
        component: OMOhomework,
      },
      {
        path: '/home/OMO/OMOHomework/OMOhomeworkList',
        name: 'OMOhomeworkList',
        component: OMOhomeworkList
      },
      {
        path: '/home/tempalteList',
        name: 'tempalteList',
        component: tempalteList,
      },
      {
        path: '/home/tempalteTaskList',
        name: 'tempalteTaskList',
        component: tempalteTaskList,
      },
      {
        path: '/home/homeWorkListTotal',
        name: 'homeWorkListTotal',
        component: homeWorkListTotal,
      },
      {
        path: '/home/OMODetail',
        name: 'OMODetail',
        component: OMODetail,
        redirect: '/home/OMODetail/student',
        children: [
          {
            path: '/home/OMODetail/student',
            name: 'OMOstudent',
            component: OMOstudent
          },
          {
            path: '/home/OMODetail/task',
            name: 'OMOtask',
            component: OMOtask
          },
          {
            path: '/home/OMODetail/templateTask',
            name: 'templateTask',
            component: OMOtemplate,
          },
          {
            path: '/home/OMODetail/report',
            name: 'OMOreport',
            component: OMOreport
          },
          {
            path: '/home/OMODetail/signIn',
            name: 'OMOsignIn',
            component: OMOsignIn
          }
        ]
      },
      {
        path: '/home/OMOeditReport',
        name: 'OMOeditReport',
        component: OMOeditReport
      },
      {
        path: '/home/approval',
        name: 'OMOapproval',
        component: OMOapproval
      },
      /* 👆👆 OMO线下班 👆👆 */
      {
        path: '/home/courseCardMan',
        name: 'courseCardMan',
        component: courseCardMan
      },
      {
        path: '/home/createCourseCard',
        component: createCourseCard
      },
      {
        path: '/home/activationCode/:id',
        component: activationCode
      },
      {
        path: '/home/bookList',
        name: 'bookList',
        component: bookList
      },
      {
        path: '/home/addBook',
        name: 'addBook',
        component: addBook
      },
      {
        path: '/home/setSheet',
        name: 'setSheet',
        component: setSheet
      },
      {
        path: '/home/bookDetail',
        name: 'bookDetail',
        component: bookDetail
      },
      {
        path: '/home/o2o',
        name: 'o2o',
        component: o2o
      },
      {
        path: '/home/o2o/create',
        name: 'o2o/create',
        component: o2oCreate
      },
      {
        path: '/home/o2o/detail',
        name: 'o2o/detail',
        component: o2oDetail
      },
      {
        path: '/home/thirdParty',
        name: 'thirdParty',
        component: thirdParty
      },
      {
        path: '/home/qrCode',
        name: 'qrCode',
        component: Qrcode
      },
      {
        path: '/home/addExam',
        name: 'addExam',
        component: AddExam
      },
      {
        path: '/home/dataClean',
        name: 'dataClean',
        component: dataClean
      },
      {
        path: '/home/userProxyList',
        component: userProxyList,
      }
    ]
  },
]