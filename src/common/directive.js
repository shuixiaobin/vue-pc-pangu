import Vue from 'vue'
import store from '@/store/index'

Vue.directive('goAnchor', 		//简写方式，只关心bind 和 update
  function(el,binding) {
    if(binding.value.id){
      el.addEventListener("click", function(){
        let anchor = document.getElementById(binding.value.id)
        document.getElementById('container').scrollTop = anchor.offsetTop;
      })
    }
  });

  Vue.directive('auth', {
    inserted (el, binding) {
      const componentMap = store.getters['auth/buttonsList'];
      if (!componentMap.includes(binding.value)) {
        el.parentNode.removeChild(el)
      }
    }
  })


  const bodyClickhandlers = []

  window.addEventListener('click', function (e) {
    const target = e.target
    bodyClickhandlers.forEach(fn => {
      if (!fn.el || !fn.el.contains(target))
        fn()
    })
  })

  Vue.directive('bodyclick', {
    inserted (el, binding) {
      binding.value.el = el
      bodyClickhandlers.push(binding.value)
    },
    unbind (el, binding) {
      const index = bodyClickhandlers.indexOf(binding.value)
      if (index !== -1) {
        bodyClickhandlers.splice(index, 1)
      }
    }
  })
Vue.directive('inputFilter', {
  bind (el, binding) {
    let inputHandler = null;
    if (binding.arg == 'number') {
      inputHandler = numberFilter;
    } else if (binding.arg == 'float') {
      inputHandler = floatFilter;
    }
    el.addEventListener('input', inputHandler, true);
    function numberFilter (event) {
      // 去掉非数字
      let tempStr = ('' + event.target.value).replace(/[^0-9]+/g , '');
      // 匹配位数
      if (binding.value) {
        let reg = new RegExp (`^[0-9]{0,${binding.value}}`);
        let match = tempStr.match(reg);
        event.target.value = match && match.length ? match[0] : '';
      } else {
        event.target.value = tempStr;
      }
    }
    function floatFilter (event) {
      let reg = new RegExp (`^-?\\d*(\\.\\d{0,${binding.value || ''}})?`);
      let match = ('' + event.target.value).match(reg);
      let tempStr = match && match.length ? match[0] : '';
      event.target.value = tempStr;
    }
  }
}) 
