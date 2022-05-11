<template>
	<view class="order-user-panel flex flex-end item-center">
		<view v-if="status === 0 || status === 1 || status === 2 || status === 3"
			class="order-btn order-btn--none mr-24" @click="cancel">
			取消订单
		</view>
		<view v-if="status === 0" class="order-btn order-btn--info">
			立即付款
		</view>
		<view v-if="status === 3" class="order-btn order-btn--info" @click="orderComplete()">
			确认完成
		</view>
	</view>
</template>

<script>
	import {put} from '@/util/request.js'
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
