import { myGet, myPost } from './http'
export const getCategroy = () => myGet(`${PHP_URL}/v5/blue/class/class_category`) //获取考试类型
export const getBookList = params => myGet(`${PHP_URL}/v5/blue/book/book_list`, params) //获取图书列表
export const getCostPerSheet = () => myGet(`${PHP_URL}/v5/blue/book/cost_per_sheet`) //获取每印张成本
export const setCostPerSheet = (params) => myPost(`${PHP_URL}/v5/blue/book/set_cost_per_sheet`, params) //设置每印张成本
export const addBook = params => myPost(`${PHP_URL}/v5/blue/book/update_or_create_book`, params) //添加修改图书
export const bookDetail = params => myGet(`${PHP_URL}/v5/blue/book/book_info`, params) //查看图书详情
export const bookUpdate = params => myPost(`${PHP_URL}/v5/blue/book/update_status`, params) //图书上下线
export const updateSure = params => myPost(`${PHP_URL}/v5/blue/book/update_judge`, params) //图书上线提示
