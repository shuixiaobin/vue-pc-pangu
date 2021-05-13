/* 菜单权限结构 

 按钮指令用法 : v-auth="'OL_EXPORT'"
*/



/* 
订单中心：
      订单列表(ORDER_LIST)  ===> 导出(OL_EXPORT)  查询(OL_FIND) 、查看(OL_DETAIL) 
      订单服务：
          代报名服务(REPLACE_SIGN): ===>0元代报提交(RS_ZERO)  非0元代报提交(RS_SUBMIT) 
          补退额服务(BTE_SERVER): ===>查询(BTES_FIND)  查看(BTES_VIEW) 手机号是否可见(BTES_PHONE_VISIVLE)  批量导入(BTES_IMPORT)
					协议班服务(PROTOCOL_SERVER) ===> 查询(PS_CLASS_FIND) 招生管理(PS_ADMISS_MANAGE) 查询(PS_USER_FIND)	确认审核(PS_CONFIRM_AUDIT) 查看订单(PS_VIEW_ORDER) 笔面试协议(PS_INTERVIEW_AGREEMENT) 协议退费申请表(PS_REFUND_APPLICATION_FORM) 个人信息(PS_PERSONAL_INFO)	补充信息(PS_SUPPLEMENT_INFO)	上传协议(PS_UPLOAD_PROTOCOL)	下载协议(PS_DOWNLOAD_PROTOCOL)	协议退费提交(PS_PROTOCOL_REFUND_SUBMIT)	 是否转结(PS_ISTURN)
      服务审核：
          代报名审核(RS_SHENHE): ===>   导出(RSS_EXPORT)   通过(RSS_PASS) 驳回(RSS_CANCEL) 批量通过(RSS_MUCH_PASS) 批量驳回(RSS_MUCH_CANCEL) 撤销申请（RSS_CANCEL_APPLI）
          补退额审核(BTE_SHENHE): ===> 导出(BTES_EXPORT)   通过(BTES_PASS) 驳回(BTES_CANCEL) 批量通过(BTES_MUCH_PASS) 批量驳回(BTES_MUCH_CANCEL) 申请记录（BTES_APPLI_RECORD） 撤销申请（BTES_CANCEL_APPLI）
          协议班退费审核(XYB_SHENHE): ===> 查询(XYB_FIND) 通过(XYB_PASS) 驳回(XYB_CANCEL) 申请记录(XYB_APPLI_RECORD) 查看申请表(XYB_VIEW_APPLI_FORM) 下载申请表(XYB_DOWNLOAD_APPLI_FORM)
网图:
      学员列表（STUDENT_LIST）==>查看(SL_DETAIL)
      标签管理（TAG_MANAGE）==>新增来源（TM_ADDSOURCE）
      用户分群管理(USER_FQ_MANAGE) ===>新建用户分群(UFM_ADD) 查看(UFM_DETAIL) 下载(UFM_DOWN)  删除(UFM_DETELE)  
      广告线索分配计划(AD_CATE_PLAN)  ===>配置被动（ACP_PZBD）  修改被动（ACP_EDIT）主动批改（ACP_ZDPG）数据主动（ACP_SJZD）课程计划（ACP_KCJH）
数据中心：
      APP推广渠道管理 (APP_AD_MANAGE)    ===> 导出(AAM_EXPORT) 添加渠道(OL_ADDQD)  添加渠道分类(OL_ADDTYPE)
			注册数据管理(REGIST_DATA_MANAGER)  ===> 查询(DATA_QUERY)

教师管理：
      教师信息 (TEACHER_INFO)  ===》总部新增(TI_HEAD_ADD) 分部新增（TI_BRANCH_ADD）总部编辑(TI_HEAD_EDIT) 分校编辑（TI_BRANCH_EDIT） 删除(TI_DETELE)  TI_HEAD_ONLINE（总部正常） TI_BRANCH_ONLINE（分校正常） TI_BRANCH_OFFLINE（分校下线） TI_HEAD_OFFLINE（总部下线）
      教师评价 ：
              直播评价(ZHIBO_PINGJIA)  ===》导出(ZP_EXPORT) 
              课程评价(CLASS_PINGJIA)  ===》教师导出(TEACHER_EXPORT)  课程导出(CLASS_EXPORT) 课程设置可见属性（CLASS_SET_LOOK）教师设置可见属性（TEACHER_SET_LOOK）
      助教信息(ZHUJIAO_INFO)  ===》新增（ZHU_ADD）修改（ZHU_EDIT）禁用（ZHU_BAN）

教师服务：
      我的课表（MY_CLASS_LIST）  ===》进入教室（MCL_ROOM）
      我的评价（MY_PINGJIA） ===》导出(MP_EXPORT)
      我的课时（MY_CLASS_TIME） ===》导出(MCT_EXPORT)


权限管理：
      角色管理（ROLE_MANAGE）==>新增（RM_ADD） 编辑（RM_EDIT） 删除（RM_DETELE）预览（RM_DETAIL）编辑权限（RM_EDIT_POWER）
      部门管理（DEPART_MANAGE）==》新增（DM_ADD） 编辑（DM_EDIT） 删除（DM_DELETE）
      人员管理（PERSON_MANAGE）==> 新增（PM_ADD）编辑（PM_EDIT）锁定（PM_BAN）解禁用户（PM_UNBAN）修改手机 (PM_UPDATE_PHONE)
      权限配置 (AUTH_CONFIG) ==> 新增/编辑 (AC_ADD) 删除 (AC_DELETE)

运营管理：
      轮播广告管理（ADVERT） ==》增加一个轮播广告（ADM_ADD） 修改（ADM_EDIT）审核（ADM_CHECK）  下线（ADM_OFFLINE） 删除（ADM_DELETE） 清除缓存（ADM_CLEAR）
      活动管理：
            直降活动 (PRICE_OFF_ACTIVITY) ===> 查询(POA_FIND) 查看(POA_DETAIL) 新增(POA_ADD) 编辑(POA_EDIT) 删除(POA_DELETE) 上线(POA_ONLINE) 下线(POA_OFFLINE) 批量删除(POA_BATCH_DELETE) 批量上线(POA_BATCH_ONLINE) 批量下线(POA_BATCH_OFFLINE)
            打折活动 (DISCOUNT_ACTIVITY) ===> 查询(DA_FIND) 查看(DA_DETAIL) 新增(DA_ADD) 编辑(DA_EDIT) 删除(DA_DELETE) 上线(DA_ONLINE) 下线(DA_OFFLINE) 批量删除(DA_BATCH_DELETE) 批量上线(DA_BATCH_ONLINE) 批量下线(DA_BATCH_OFFLINE)
            买赠活动 (GIFT_ACTIVITY) ===> 查询(GA_FIND) 查看(GA_DETAIL) 新增(GA_ADD) 编辑(GA_EDIT) 删除(GA_DELETE) 上线(GA_ONLINE) 下线(GA_OFFLINE) 批量删除(GA_BATCH_DELETE) 批量上线(GA_BATCH_ONLINE) 批量下线(GA_BATCH_OFFLINE)
            AB优惠 (AB_SALE_ACTIVITY) ===> 查询(ASA_FIND) 查看(ASA_DETAIL) 新增(ASA_ADD) 编辑(ASA_EDIT) 删除(ASA_DELETE) 上线(ASA_ONLINE) 下线(ASA_OFFLINE) 批量删除(ASA_BATCH_DELETE) 批量上线(ASA_BATCH_ONLINE) 批量下线(ASA_BATCH_OFFLINE) 批量导入(ASA_BATCH_IMPORT)

            职位库 (JOB_LIB) ==> 上传职位库(JL_UPLOAD)  省份排序(JL_SFPX)   线索导出(JL_XSDC) 
            微信二维码领取(VX_CODE)  ==> 新建(VC_NEW)  修改(VC_EDIT)  删除(VC_DELETE) 上线(VC_ONLINE) 下线(VC_LINEOFF) 
            下载(VC_DOWN) 复制链接(VC_COPY)                  
            招警成绩查询(POLICE_SCORE) ==>  上传服务器(PS_UPLOAD)
            拼团活动(PDD_HD)  ==> 创建活动(PH_NEW)  编辑(PH_EDIT) 设置失效(PH_INVALID)  复制链接(PH_COPY)  效果查看(PH_EFFECT)  
            上线(PH_ONLIE) 

督学中心：
			课程档案：(COURSE_FILES)	 ==>  查询(CF_FIND)  学员表(CF_STUDENTS_TABLE)	push推送(CF_PUSH)  数据报表(CF_DATA_REPORT)  push推送提交(CF_PUSH_SUBMIT)  学员表查询(CF_STUDENTS_TABLE_FIND)  导出学员表(CF_EXPORT_STUDENT_TABLE)  是否加群(CF_IS_ADD_GROUP)  群服务备注(CF_GROUP_NOTE)
           
其他：
      小鹅通课程绑定 (XIAO_E_TONG) ==> 查询(XET_FIND) 绑课(XET_BIND)
*/