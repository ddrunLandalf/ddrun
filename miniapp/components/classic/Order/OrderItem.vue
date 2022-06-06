<template>
	<view class="order-item" @click="navToDetail">
		<view class="flex flex-between item-center">
			<view class="fo-28 bold">
				{{serviceTypeFilter(options.serviceType)}}
			</view>
			<view class="flex flex-end item-center">
				<view class="fo-28" :style="{color: statusColorFilter(options.status)}">
					{{statusFilter(options.status)}}
				</view>
				<view class="iconfont icon-arrow-right fo-28 fo-9"></view>
			</view>
		</view>

		<view class="flex flex-between item-center">
			<view class="flex flex-start item-center mt-16">
				<view class="iconfont icon-clock fo-28 fo-9"></view>
				<view class="ml-30 fo-9 fo-28">
					{{formatDateUTC(options.updateTime, 'yyyy/MM/dd hh:mm')}}
				</view>
			</view>
			<view class="fo-28 bold fo-3">
				{{options.payAmount}}元
			</view>
		</view>
		<view class="flex flex-start item-center mt-16">
			<view class="iconfont icon-desc fo-28 fo-9"></view>
			<view class="ml-30 fo-3 fo-28  ell">
				{{options.goodsDesc}}
			</view>
		</view>
		<view class="flex flex-start item-center mt-16">
			<dot color="green" />
			<view v-if="options.startAddress" class="fo-6 fo-24 ell ml-30">
				{{options.startAddress.province}}{{options.startAddress.city}}{{options.startAddress.district}}{{options.startAddress.addressDetail}}
			</view>
			<view v-else class="fo-6 fo-24 ell ml-30">
				就近购买
			</view>
		</view>
		<view class="flex flex-start item-center mt-16">
			<dot color="orange" />
			<view class="fo-6 fo-24 ell ml-30">
				{{options.endAddress.province}}{{options.endAddress.city}}{{options.endAddress.district}}{{options.endAddress.addressDetail}}
			</view>
		</view>
		<view class="flex flex-between item-center mt-24">
			<view class="fo-28 fo-9">
				{{options.distanceText || ''}}
			</view>
			<view v-if="isRider" class="flex flex-end item-center ">
				<view v-if="options.status === 1" class="order-btn order-btn--none mr-16" >
					取消接单
				</view>
				<view v-if="options.status === 1" class="order-btn order-btn--info" @click.stop="orderReceive(options.orderNo)">
					立即接单
				</view>
				<view v-if="options.status === 2" class="order-btn order-btn--none mr-16" @click="cancelOrder" >
					取消配送
				</view>
				<view v-if="options.status === 2" class="order-btn order-btn--info" @click.stop="orderDeliver(options.orderNo)">
					确认送达
				</view>
				<view v-if="options.status === 3" class="order-btn order-btn--info" @click.stop="orderComplete(options.orderNo)">
					确认完成
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDateUTC
	} from '../../../util/date.js'
	import { orderReceive,orderDeliver,orderComplete } from '@/util/api.js'
	export default {
		props: {
			options: {
				type: Object,
				default: {}
			},
			isRider: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			formatDateUTC,
			cancelOrder(){
				uni.navigateTo({
					url: '/pages/order/reason/reason?orderNo='+this.options.orderNo + '&isRider=1'
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
			serviceTypeFilter(type) {
				if (type === 'helpDeliver') {
					return '帮我送'
				} else if (type === 'helpGet') {
					return '帮我取'
				} else {
					return '帮我买'
				}
			},
			navToDetail() {
				uni.navigateTo({
					url: '/pages/order/detail/detail?orderNo=' + this.options.orderNo + (this.isRider ? '&isRider=1':'')
				})
			},
			statusFilter(status) {
				switch (status) {
					case -2:
						return '已取消'
					case -1:
						return '已关闭'
					case 0:
						return '待付款'
					case 1:
						return '等待接单'
					case 2:
						return '配送中'
					case 3:
						return '配送完成,待确认'
					case 4:
						return '已完成'
				}
			},
			// 状态颜色
			statusColorFilter(status) {
				switch (status) {
					case -2:
						return '#aaaaaa'
					case -1:
						return '#333333'
					case 0:
						return '#0099FF'
					case 1:
						return '#ff6633'
					case 2:
						return '#FF6666'
					case 3:
						return '#FF3300'
					case 4:
						return '#00CC66'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-item {
		padding: 30rpx;
		box-shadow: 0 0 10rpx 10rpx rgba($color: #000000, $alpha: 0.05);
		border-radius: 8rpx;
		background-color: #ffffff;
		margin-bottom: 30rpx;
		
	}
</style>
