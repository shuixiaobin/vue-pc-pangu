export function makeMap (arr, key) {
  const res = Object.create(null)
  if (!key) {
    arr.forEach(key => (res[key] = true))
  } else {
    arr.forEach(obj => res[obj[key]] = obj)
  }
  return res
}

export function deepCopy (obj) {
  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(item => deepCopy(item))
  } else {
    let res = {}
    Object.entries(obj).forEach(([key, val]) => {
      res[key] = deepCopy(val)
    })
    return res
  }
}

export function debounce (func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
      var last = Date.now() - timestamp;

      if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
      } else {
          timeout = null;
          if (!immediate) {
              result = func.apply(context, args);
              if (!timeout) context = args = null;
          }
      }
  };

  return function() {
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
          result = func.apply(context, args);
          context = args = null;
      }

      return result;
  };
}
