import Vue from "vue";
import toast from "./index.vue";
const ToastConstructor = Vue.extend(toast);

let instance;
let timer = null;
let Toast = options => {
  if (!instance) {
    instance = new ToastConstructor();
    instance.$mount()
    document.body.appendChild(instance.$el);
  }
  if (timer) {
    clearTimeout(timer);
    timer = null;
    instance.visible = false;
    instance.message = "";
  }
  let time = 1500;
  if (typeof options === "string") {
    instance.message = options;
  } else if (typeof options === "object") {
    let { message, time } = options;
    instance.message = message;
    time = time || 1500;
  } else {
    return;
  }
  instance.visible = true;
  timer = setTimeout(() => {
    instance.visible = false;
    clearTimeout(timer);
    timer = null;
    instance.message = "";
  }, time);
};
Toast.close = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    instance.visible = false;
    instance.message = "";
  }
};
Toast.install = Vue => {
  Vue.prototype.$Toast = Toast;
};
export default Toast;
