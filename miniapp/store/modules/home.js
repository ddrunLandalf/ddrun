import {
	HELP_DELIVER,
	HELP_GET,
	HELP_BUY,
	BUY_NEARBY,
	BUY_APPOINT
} from '@/util/constant.js'
import {
	$get,put
} from '@/util/request.js'
export default {
	namespaced: true,
	state: {
		tags: [],
		weights: [],
		weightCurrent: 0,
		desc: '', // 物品描述
		tabCurrent: HELP_DELIVER,
		startAddress: {},
		endAddress: {},
		buyStyle: BUY_NEARBY,
		notice: {},
		share: {},
		isOp: true, // 是否开通运营
		feeTips: [],
		unreadCoupons: [], // 未读优惠券
	},
	mutations: {
		setIsOp(state, val){
			state.isOp = val
		},
		clear(state, val) {
			state.weightCurrent = 0;
			state.desc = '';
			state.buyStyle = BUY_NEARBY;
		},
		setBuyStyle(state, val) {
			state.buyStyle = val;
		},
		setTabCurrent(state, val) {
			state.tabCurrent = val
		},
		setWeightCurrent(state, val) {
			state.weightCurrent = val
		},
		setWeights(state, val) {
			state.weights = val
		},
		setTags(state, val) {
			state.tags = val
		},
		setDesc(state, val) {
			state.desc = val
		},
		appendDesc(state, val) {
			state.desc += val + ' '
		},
		setStartAddress(state, val) {
			state.startAddress = JSON.parse(JSON.stringify(val))
		},
		setEndAddress(state, val) {
			state.endAddress = JSON.parse(JSON.stringify(val))
		},
		setDefaultAddress(state, val) {
			if (state.tabCurrent === HELP_DELIVER) {
				state.startAddress = val
				state.endAddress = JSON.parse(JSON.stringify({}))
			} else if (state.tabCurrent === HELP_GET) {
				state.endAddress = val
				state.startAddress = JSON.parse(JSON.stringify({}))
			} else if (state.tabCurrent === HELP_BUY) {
				state.endAddress = val
				state.startAddress = JSON.parse(JSON.stringify({}))
			}
		},
		setNotice(state,val){
			state.notice = val
		},
		setShare(state,val){
			state.share = val
		},
		setFeeTips(state, val){
			state.feeTips = val
		},
		setUnreadCoupons(state,val){
			state.unreadCoupons = val
		}
	},
	actions: {
		async getNoticeConfig({commit}){
			const result = await $get('home/config');
			if(result.code === 200){
				commit('setNotice', result.data.notice || {});
				commit('setShare', result.data.share || {});
				if(result.data.fee){
					commit('setFeeTips', result.data.fee.feeTips)
				}
			}
		},
		async getUnreadCoupons({commit}) {
			const result = await $get('coupon/unread')
			if(result.code === 200){
				commit('setUnreadCoupons', result.data.data);
				if(result.data.data.length > 0){
					const ids = [];
					for(const item of result.data.data){
						ids.push(item.id)
					}
					put('coupon/read',{ids})
				}
			}
		}
	}
}
