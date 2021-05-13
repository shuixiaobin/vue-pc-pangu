import axios from 'axios'
import { Message ,Loading} from 'element-ui'
import router from '@/router/index.js'
const instance = axios.create({
  baseURL: BASEURL,
  timeout: 30000,
  withCredentials: false
})


let loading; //定义loading变量
function startLoading() {
  //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……'
  })
}

function endLoading() {
  //使用Element loading-close 方法
  loading.close()
}

let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}


// 拦截器
instance.interceptors.request.use(
  config => {
    showFullScreenLoading()
    const token = localStorage.getItem('pg_token')
    if (token && !config.noToken) {
      config.headers.token = token;
    }
    return config
  },
  error => {
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    tryHideFullScreenLoading()
    if (response.config.responseHandler) {
      return response.config.responseHandler(response)
    }
    if (response.status !== 200) {
      throw new Error(response.data.message)
    }
    return response
  },
  error => {
    tryHideFullScreenLoading()
    if (error.response.status == 401) {
      let urlName = router.app.$route.name
      if (urlName != 'login') {
        router.push({ name: 'login', query: { redirectUrlName: urlName } })
      }
      Message.error('用户会话过期, 请重新登录')
    } else {
      try {
        if (error.config.responseHandler) {
          error.config.responseHandler(error.response)
        }
        Message.error(error.response.data.message)
      } catch(e) {
        Message.error(e.message)
      }
    }
    //console.log(error.response.data.message)
    // Message.error(error.message)
    throw error.response.data
  }
)

export function myGet(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params: params,
        headers
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function myGet1(url, config) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, config)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function myPost(url, data = {}, options = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data, options).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

export function myPost2(url, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, {
        headers: headers
      })
      .then(
        response => {
          resolve(response.data)
        },
        err => {
          reject(err)
        }
      )
  })
}

export function myPost1(url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data.data).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

export function myPost3(url, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, data.data, {
        headers: headers
      })
      .then(
        response => {
          resolve(response.data)
        },
        err => {
          reject(err)
        }
      )
  })
}

export function myPut(url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.put(url, data).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}
export function myDelete(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        params: params
      })
      .then(
        response => {
          resolve(response.data)
        },
        err => {
          reject(err)
        }
      )
  })
}
export function myDelete1(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        params: params,
        headers: headers
      })
      .then(
        response => {
          resolve(response.data)
        },
        err => {
          reject(err)
        }
      )
  })
}

export function fileHandler (response, blob) {
  const url = URL.createObjectURL(blob)
  response.data = {
    code: 1000000,
    data: url
  }
  return response
}

export function jsonHandler (response) {
  const text = Utf8ArrayToStr(new Uint8Array(response.data))
  response.data = JSON.parse(text)
  return response
}

export function ArrayBufferHandler (response) {
  const type = response.headers['content-type']
  if (typeof type === 'string') {
    if (type.search('application\/json') > -1) {
      return jsonHandler(response)
    } else {
      const blob = new Blob([response.data], {type: response.headers['content-type']})
      return fileHandler(response, blob)
    }
  } else {
    return response
  }
}

function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
  c = array[i++];
  switch(c >> 4)
  {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
    case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
    case 14:
      // 1110 xxxx  10xx xxxx  10xx xxxx
      char2 = array[i++];
      char3 = array[i++];
      out += String.fromCharCode(((c & 0x0F) << 12) |
                     ((char2 & 0x3F) << 6) |
                     ((char3 & 0x3F) << 0));
      break;
  }
  }

  return out;
}
