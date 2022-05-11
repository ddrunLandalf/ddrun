import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import store from './store'
import Card from './components/base/Card/Card.vue'
import LoadingLocation from './components/base/Loading/location.vue'
import Dot from './components/base/Dot/Dot.vue'
import LoadingOrder from './components/base/Loading/order.vue'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'
Vue.component('dd-card', Card)
Vue.component('loading-location', LoadingLocation)
Vue.component('loading-order', LoadingOrder)
Vue.component('dot', Dot)
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
