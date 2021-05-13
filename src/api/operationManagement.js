import { myGet, myPost } from './http'
// 运营管理api

// 轮播管理
export const getCategoryList = params => myGet(`${PANGU_URL}/v1/c/carousel/cate_list`, params)
export const getTableList = params => myGet(`${PANGU_URL}/v1/c/carousel/carousel_list`, params)
export const getCarouselInfo = params => myGet(`${PANGU_URL}/v1/c/carousel/carousel_info`, params)
export const addOrUpdateCarousel = params => myPost(`${PANGU_URL}/v1/c/carousel/add_or_update_carousel`, params)
export const updateStatusOrDelCarousel = params => myPost(`${PANGU_URL}/v1/c/carousel/update_status_or_del`, params)