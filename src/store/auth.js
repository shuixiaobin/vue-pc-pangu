import Util from '@/common/util'
import * as auth from '@/api/auth'
import {testSubjectMap, pandoraRootId} from '@/common/config'
import {routes} from '@/router/routes'


const store = {
  namespaced: true,
  state: {
    hasAuth: false, //是否已经获取过权限
    menus: [],
    buttonsList: [],
    routeList:[],
    menuTitile:{},
    collectionList:[
      {
        description: "订单列表",
        frontToolName: "ORDER_LIST",
        id: 2,
        menuName: "订单列表",
        menuType: 1,
        parentId: 1,
        sign: 1,
        sort: 1,
        systemId: 3,
      }
    ]
  },
  mutations: {
    setMenus (state, map) {
      const list=  handleAuthTree(map);
      state.menus = list.menus;  
      state.buttonsList =  list.components;
      // 修复控制台vuex报错
      const routesClone = JSON.parse(JSON.stringify(routes))
      Util.getMenuList(routesClone, [...state.menus]);
      state.routeList = routesClone;
      state.menuTitile =Util.getMenuTitile(map);
      state.hasAuth =true;
    },
    setCollection (state, ary) {
      state.collectionList = ary;
    },
    setNoHasAuth (state, ary) {
      state.hasAuth = false;
    }
  },
  actions: {
    getAuths ({commit, dispatch,rootState}) { 
      return auth.getAuthInfo(3).then(data => {
        if(data.code == 1000000){
          if (data.data.length > 0) {
            commit('setMenus',data.data)
          } else {
            commit('logout',null, { root: true });
            commit('setNoHasAuth');
            throw new Error('无权限信息, 请重新登录')
          } 
        }else{
          commit('logout',null, { root: true })
          commit('setNoHasAuth');
          throw new Error('无权限信息, 请重新登录')
        }
      })
    },
    getCollectAuth ({commit, dispatch,rootState}) { 
      auth.getCollection(3).then(data => {
        commit('setCollection',data.data)
      })
    }
  },
  getters: {
    routeList: state => state.routeList,
    buttonsList: state => state.buttonsList,
    menuTitile: state => state.menuTitile,
    collectionList: state => state.collectionList
  }
}



// 从树中取权限标识

function handleAuthTree(ary) {
  const menus = [];
  const components = [];
  if (!ary) return;
  getCom(ary)
  return{
    menus,
    components
  }
  function getCom(ary){
    for(var i in ary){
      if (ary[i].menuType == 1 && ary[i].frontToolName) {
        menus.push(ary[i].frontToolName)
      }else if (ary[i].menuType == 2){
        components.push(ary[i].frontToolName)
      }
      if(ary[i].children && ary[i].children.length > 0){
        getCom(ary[i].children);
      }
    }
  }
}



export default store
