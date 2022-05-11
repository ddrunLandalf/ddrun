<template>
	<view class="order-rider-panel flex flex-end item-center">
		<view v-if="status === 1" class="order-btn order-btn--none mr-16" >
			取消接单
		</view>
		<view v-if="status === 1" class="order-btn order-btn--info" @click.stop="orderReceive(no)">
			立即接单
		</view>
		<view v-if="status === 2" class="order-btn order-btn--none mr-16" @click="cancelOrder" >
			取消配送
		</view>
		<view v-if="status === 2" class="order-btn order-btn--info" @click.stop="orderDeliver(no)">
			确认送达
		</view>
		<view v-if="status === 3" class="order-btn order-btn--info" @click.stop="orderComplete(no)">
			确认完成
		</view>
	</view>
</template>

<script>
	import { orderReceive,orderDeliver,orderComplete } from '@/util/api.js'
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
			cancelOrder(){
				uni.navigateTo({
					url: '/pages/order/reason/reason?orderNo='+this.no + '&isRider=1'
				})
			},
			async orderReceive(orderNo){
				if(await orderReceive(orderNo)){
					this.$emit('refresh')
				}
			},
			async orderDeliver(orderNo){
				if(await orderDeliver(orderNo)){
					this.$emit('refresh')
				}
			},
			async orderComplete(orderNo) {
				if(await orderComplete(orderNo)){
					this.$emit('refresh')
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-rider-panel{
		padding: 30rpx;
	}
</style>
