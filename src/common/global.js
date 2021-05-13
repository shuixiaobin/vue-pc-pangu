export const userName = (() => {
    if (localStorage.getItem('userName')) {
      return localStorage.getItem('userName')
    } else {
      return 'app_ztk2058930230'
    }
})();

export const userId = (() => {
    if (localStorage.getItem('userId')) {
      return localStorage.getItem('userId')
    } else {
      return '8976508'
    }
})()
