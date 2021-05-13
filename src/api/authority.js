import { myGet, myPost, myPost2, myDelete,myPut } from './http';

export const getDepartList = params => myGet(`${BASEURL}/uc/department/v2/list`, params); //获取部门管理列表
export const getProperAuthList = params => myGet(`${BASEURL}/uc/department/v2/choice`) //上级部门信息
export const searchDepartmentHead= params => myGet(`${BASEURL}/uc/user/v2/getUserNameList`,params) //部门主管搜索
export const addDepartMent = params => myPost(`${BASEURL}/uc/department/v2/insert`, params); //添加部门
export const delDepartMent = departmentId => myDelete(`${BASEURL}/uc/department/v2/delete/${departmentId}`); //删除部门
export const departEcho = departmentId => myGet(`${BASEURL}/uc/department/v2/edit/${departmentId}`,) //部门编辑回显

export const getUserList = params => myGet(`${BASEURL}/uc/user/v2/list`,params) //用户列表
export const getSelectRoleList = params =>myGet(`${BASEURL}/uc/role/v2/findRole`) //角色下拉列表
export const uploadAvater = (formData,header) =>myPost2(`${BASEURL}/uc/file/v2/upload`,formData,header) //添加用户上传头像
export const addRole = params =>myPost(`${BASEURL}/uc/user/v2/save`,params) //保存用户
export const echoRole = userId =>myGet(`${BASEURL}/uc/user/v2/${userId}`)//用户数据回显
export const roleBlocked = (userId,bizStatus) =>myPut(`${BASEURL}/uc/user/v2/blocked/${userId}/${bizStatus}`) //用户封禁解禁
export const roleLock = (userId,lockStatus) =>myPut(`${BASEURL}/uc/user/v2/lock/${userId}/${lockStatus}`) //用户锁定解锁
export const postUpdatePhone = (params) => myPost(`${BASEURL}/uc/user/v2/updatePhone`, params); //用户修改手机号


export const getSystemList = params =>myGet(`${BASEURL}/uc/role/v2/getSystem`)
export const getRoleList = params =>myGet(`${BASEURL}/uc/role/v2`,params)
export const addNewRole = params =>myPost(`${BASEURL}/uc/role/v2`,params)
export const editNewRole = params =>myPost(`${BASEURL}/uc/role/v2`,params)
export const getPersonName = params => myGet(`${BASEURL}/uc/user/v2/check/${params}`,)
export const getDefaultPwd = params => myGet(`${BASEURL}/uc/user/v2/generate/password`)



export const getRolePower = params =>myGet(`${BASEURL}/uc/roleAuth/v2/${params}`)
export const saveRole = params =>myPost(`${BASEURL}/uc/roleAuth/v2/menu`,params)
export const saveDataPower = params =>myPost(`${BASEURL}/uc/roleAuth/v2/data`,params)
export const deleteRole = params =>myDelete(`${BASEURL}/uc/role/v2/delete/${params}`)
export const getDataPower = params =>myGet(`${BASEURL}/uc/roleAuth/v2/globalDataAuth/${params}`)


// 权限配置
export const getAuthTree = (params = 3) => myGet(`${BASEURL}/uc/tool/menu/tree/${params}`) // 获取权限树，参数名是系统id，3是盘古
export const saveAuth = params => myPost(`${BASEURL}/uc/tool/menu/save`, params) // 新增权限
export const getAuthDetail = params => myGet(`${BASEURL}/uc/tool/menu/detail/${params}`) // 获取权限信息 参数名是权限id
export const deleteAuth = params => myDelete(`${BASEURL}/uc/tool/menu/del/${params}`) // 删除权限 参数名是权限id

