import Router from 'vue-router'
import Vue from 'vue'
import store from '@/store/index'
import routes from './routes'
import {Message} from 'element-ui'


Vue.use(Router)

const router = new Router({
  routes
})


router.beforeEach(async (to, from, next) => {
  const token = store.state.token
  if (to.name === 'login' || to.path === '/userDetail' || to.path === '/userList') {
    next()
  } else if (!token) {
    next({
      name: 'login'
    })
  }else{
    if (!store.state.auth.hasAuth) {
      try {
        await store.dispatch('auth/getAuths')
      } catch (e) {
        Message.warning(e.message)
        next({name: 'login'})
      }
    }else{
      next();
    }

    if (!to.meta || !to.meta.access) {//不需要判断权限的
        next()
    }else{
      const menuMap = store.getters['auth/menuTitile']
      if (menuMap[to.meta.access]) {
        if (to.name === "ADplan" && !store.state.starMapNum) {
          Vue.prototype.$message({
            type: 'warning',
            message: '您暂无本页面权限，请联系管理员！',
          });
        } else {
          next();
        }
      } else {
        if (!from.name) {
          next({name: 'homePage'})
        } else {
          Message.warning('无权限')
          next(false)
        }
      }
    }
  
  }

});

export default router
