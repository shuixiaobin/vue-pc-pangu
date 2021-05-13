    import { myGet, myPost, myPut } from '@/api/http'

    export const upload = ()=>myPost(`${ZWK_URL}/admin/position`)
    export const getYears=()=>myGet(`${ZWK_URL}/admin/position/year`)
    export const getProvince=(payload)=>myGet(`${ZWK_URL}/admin/position/province`,payload)
    export const provinceSort=(payload )=>myPost(`${ZWK_URL}/admin/position/province/sort`,payload)
    export const getSortList = () => myGet(`${ZWK_URL}/admin/position/examTypeSort`)
    export const saveSortList = data => myPut(`${ZWK_URL}/admin/position/examTypeSort`, data)
