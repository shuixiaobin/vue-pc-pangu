// php接口base-url
// webpack环境变量需对应修改 161线上，202测试
//export const BASEURL = '//ns.huatu.com'
// export const BASEURL = 'http://123.103.86.52'
// //export const PHP_URL = 'http://api.huatu.com/lumenapi'
// export const PHP_URL = 'http://testapi.huatu.com/lumenapi'
// 获取url参数
export const getParams = (key = '') => {
  if (key === '') {
    return
  }
  let url = window.location.href
  let reCat01 = '/' + key + '=[^&]*/g'
  let reCat = eval('(' + reCat01 + ')') //对象化
  let value
  try {
    value = window.location.href
      .split('?')[1]
      .match(reCat)[0]
      .replace(`${key}=`, '')
  } catch (e) {
    value = ''
  }
  return value
}

export const  parseQueryString = function(url) {
  let obj = {}
  let arr = []

  url = url.replace(/^.*?\?/, '')
  url = url.replace(/#.*$/, '')
  arr = url.split('&')

  arr.forEach(el => {
    let r = el.match(/(.+)=(.*)/)
    if (r) {
      let key = r[1]
      let value = r[2] || null
      obj[key] = value
    }
  })
  return obj
}
export const removeByValue = (arr, val) => {
  //对数组原型添加删除指定项的方法
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1)
      break
    }
  }
}

export function getCookie(name) {
  let arr
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
  if ((arr = document.cookie.match(reg))) return arr[2]
  return null
}

export function setCookie(c_name, value) {
  const exdate = new Date()
  exdate.setDate(exdate.getDate() + 30)
  const domain = COOKIE_DOMAIN ? `domain=${COOKIE_DOMAIN}` : ''
  // const cn = /^[\u4e00-\u9fa5]+$/ // 中文
  // const currentVal = cn.test(value) ? encodeURI(value) : escape(value)
  const currentVal = encodeURI(value)

  const currentCookie = `${c_name}=${currentVal};expires=${exdate.toGMTString()};path=/;${domain}`

  document.cookie = currentCookie
}

export function parse_url(key = '') {
  // 定义函数
  if (key === '') {
    return ''
  }
  let url = window.location.href
  let reCat01 = '/' + key + '=[^&]*/g'
  let reCat = eval('(' + reCat01 + ')') //对象化
  let value

  try {
    value = window.location.href
      .split('?')[1]
      .match(reCat)[0]
      .replace(`${key}=`, '')
  } catch (e) {
    value = ''
  }
  return value
}



