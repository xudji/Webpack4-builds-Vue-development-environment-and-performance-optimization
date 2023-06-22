import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import { increase } from './treeshak';
import './index.css';

new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
});

if (module.hot) {
  module.hot.accept();
}

document.getElementById('btn1').onclick = function() {
  import(/* webpackChunkName: "btnChunk" */ './impModule.js').then(fn => fn.default());
}

document.getElementById("btn1").onclick = async () => {
  const imp = await import(/* webpackPrefetch: true */ "./impModule.js");
  imp.default();
};

document.getElementById("btn1").onclick = async () => {
  const imp = await import(/* webpackPreload: true */ "./impModule.js");
  imp.default();
};


import { increase} from './treeshak'
console.log(increase(1,2))