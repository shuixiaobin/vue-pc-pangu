import { userGroupFormula } from '@/api/netMap'

export const dimensions = makeCache(function () {
  return userGroupFormula({column:'behavior'}).then(res =>
    res.data.map(item=>({
      label:item[0].label,
      type:item[0].label,
      options:item.filter(item2 => item2.value!=='')
    }))
  )
})

export const formula = function (data) {
  return userGroupFormula(data).then(res =>
    res.data.map(item=>{
      if(String(item.multiChoice)){
        return {label:item.label,value:item.value,multiChoice:item.multiChoice}       
      }else{
        return {label:item.label,value:item.value}
      }
    })
  )
}

function makeCache(fn) {
  let data
  let pending
  return function () {
    if (data != null) return data
    if (pending) return pending
    const ret = fn()
    if (ret instanceof Promise) {
      return (pending = ret.then(r => {
        data = r
        pending = null
        return data
      }))
    } else {
      return (data = ret)
    }
  }
}