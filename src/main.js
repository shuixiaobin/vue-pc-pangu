// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import "./assets/flat";
import Vue from "vue";
import store from "./store/index.js";
import "./assets/style/cssreset.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import "./assets/css/icon.css";
import * as https from "@/api/http.js";
import App from "./App";
import router from "./router";
import tdDraggable from "@/config/draggable";
import util from "@/common/util.js";
import axios from "axios";
import VueJsonp from "vue-jsonp";
import "./common/clipBoard"; // 全局剪切板
import Toast from "@/components/Toast";
import './common/directive.js'
import  qs from 'qs'
import menuTitle from '@/components/menuTitle'
import LazyLoad from '@/components/lazyLoad'

let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/chart/pie");
require("echarts/lib/chart/radar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/legendScroll"); //图例滚动

Vue.prototype.$echarts = echarts;
Vue.component("td-draggable", tdDraggable);
Vue.component('MenuTitle', menuTitle)
Vue.component('LazyLoad', LazyLoad)
Vue.config.productionTip = false;
Vue.use(Toast);
//设置eventBus传值
window.eventBus = new Vue();
Vue.prototype.axios = axios;
Vue.prototype.myGet = https.myGet;
Vue.prototype.myPost = https.myPost;
Vue.prototype.myPost1 = https.myPost1;
Vue.prototype.myPost2 = https.myPost2;
Vue.prototype.myPost3 = https.myPost3;
Vue.prototype.myPut = https.myPut;
Vue.prototype.myDelete = https.myDelete;
Vue.prototype.myDelete1 = https.myDelete1;
Vue.prototype.$util = util;
Vue.prototype.$qs = qs
Vue.use(ElementUI);
Vue.use(VueJsonp);



/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
