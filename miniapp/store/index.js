import Vue from 'vue'
import Vuex from 'vuex'
import profile from './modules/profile.js'
import server from './modules/server.js'
import home from './modules/home.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions:{},
	modules: {
		profile,
		server,
		home
	},
})

