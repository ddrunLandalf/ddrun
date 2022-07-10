<template>
	<view class="order-user-panel flex flex-end item-center">
		<view v-if="status === 0 || status === 1 || status === 2 || status === 3"
			class="order-btn order-btn--none mr-24" @click="cancel">
			取消订单
		</view>
		<view v-if="status === 0" class="order-btn order-btn--info" @click="payAgent">
			立即付款
		</view>
		<view v-if="status === 3" class="order-btn order-btn--info" @click="orderComplete()">
			确认完成
		</view>
	</view>
</template>

<script>
	import {put,post} from '@/util/request.js'
	import {orderCompleteByUser} from '@/util/api.js'
	export default {
		props: {
			status: {
				type: Number,
				default: 0
			},
			no: {
				type: String,
				default: ''
			}
		},
		methods: {
			async payAgent(){
				const home = this.$store.state.home;
				const orderTmpId = home.notice.orderTempId;
				const provider = uni.getStorageSync('provider');
				const result = await post('order/payagain', {orderNo: this.no});
				uni.hideLoading();
				if (result.code !== 200) {
					return;
				}
				
				if (provider !== 'weixin') {
					uni.redirectTo({
						url: '/pages/order/detail/detail?orderNo=' + result.data.orderNo
					})
					return;
				}
				// 调起支付
				uni.getProvider({
					service: 'payment',
					complete: (res) => {
						if (res.errMsg === 'getProvider:ok') {
							const provider = res.provider[0];
							uni.requestPayment({
								provider,
								orderInfo: {},
								timeStamp: result.data.timeStamp,
								nonceStr: result.data.nonce_str,
								package: 'prepay_id=' + result.data.prepay_id,
								signType: 'MD5',
								paySign: result.data.paySign,
								complete: (res) => {
									if(res.errMsg === 'requestPayment:fail cancel'){
										uni.showToast({
											title: '支付取消',
											icon: 'none',
											duration: 800
										})
									}else{
										uni.showToast({
											title: '支付成功',
											icon: 'success',
											duration: 800
										})
									}
									const timeout = setTimeout(() => {
										uni.redirectTo({
											url: '/pages/order/detail/detail?orderNo=' +
												result.data.orderNo
										})
										clearTimeout(timeout)
									}, 800)
								}
							})
						}
					}
				})
			},
			async cancel() {
				if(this.status === 0 || this.status === 1){
					uni.showLoading({
					})
					const res = await put('order/cancel', {
						orderNo: this.no
					})
					uni.hideLoading();
					if(res.code === 200){
						this.$emit('refresh')
					}
				} else {
					uni.navigateTo({
						url: '/pages/order/reason/reason?orderNo='+this.no
					})
				}
			},
			async orderComplete() {
				if(await orderCompleteByUser(this.no)){
					this.$emit('refresh')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-user-panel {
		padding: 30rpx;
	}
</style>
