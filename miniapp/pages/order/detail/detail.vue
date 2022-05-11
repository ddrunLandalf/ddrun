<template>
	<view class="p-30">
		<view class="flex flex-between mb-28">
			<view class="fo-50">
				{{order.statusLabel}}
			</view>
			<view class="fo-50 bold">
				{{order.payAmount}} <text class="fo-28"> 元</text>
			</view>
		</view>
		<AddressShow :type="order.serviceLabel" :start="order.startAddress" :end="order.endAddress" :isRider="isRider" />
		<dd-card padding="30rpx" width="630rpx" margin="30rpx 0 0 0">
			<view class="flex flex-between item-center">
				<view class="publish-label fo-28 bold">
					物品描述:
				</view>
				<view class="publish-content fo-28">
					{{ order.goodsDesc }}
				</view>
			</view>
			<view class="mt-32 flex flex-between item-center">
				<view class="publish-label fo-28 bold">
					配送路程:
				</view>
				<view class="publish-content fo-28">
					{{order.distanceLabel}}
				</view>
			</view>

			<view class="mt-32 flex flex-between item-center">
				<view class="publish-label fo-28 bold">
					物品重量:
				</view>
				<view class="publish-content fo-28">
					{{order.weightLabel}}
				</view>
			</view>
		</dd-card>
		<dd-card v-if="rider.mobileNumber && order.riderNo" padding="30rpx" width="630rpx" margin="30rpx 0 0 0"
			@click="phoneClick">
			<view class="flex flex-between item-center">
				<view class="flex flex-start item-center">
					<view class="rider-avatar">
						<view class="iconfont icon-rider"></view>
					</view>
					<view class="fo-28 ell ml-30">
						{{rider.realname}}
					</view>
				</view>
				<view class="iconfont icon-tel  fo-32 fo-green">
				</view>
			</view>
		</dd-card>
		<dd-card padding="30rpx" width="630rpx" margin="30rpx 0 0 0">
			<view class="flex flex-between item-center">
				<view class="publish-label fo-24 ">
					订单编号
				</view>
				<view class="publish-content fo-24 text-right">
					{{ order.orderNo }}
				</view>
			</view>
			<view class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					起步价格
				</view>
				<view class="publish-content fo-24 text-right">
					{{ order.startPrice }}元
				</view>
			</view>
			<view v-if="order.distancePrice > 0" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					路程价格
				</view>
				<view class="publish-content fo-24 text-right">
					{{ order.distancePrice }}元
				</view>
			</view>
			<view v-if="order.weightPrice > 0" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					重量价格
				</view>
				<view class="publish-content fo-24 text-right">
					{{ order.weightPrice }}元
				</view>
			</view>
			<view v-if="order.timePrice > 0" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					时间段价格
				</view>
				<view class="publish-content fo-24 text-right">
					{{ order.timePrice }}元
				</view>
			</view>

			<view v-if="order.couponDiscount > 0" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					优惠券
				</view>
				<view class="publish-content fo-24 text-right">
					-{{ order.couponDiscount }}元
				</view>
			</view>

			<view class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					创建时间
				</view>
				<view class="publish-content fo-24 text-right">
					{{ formatDateUTC(order.createTime, 'yyyy/MM/dd hh:mm') }}
				</view>
			</view>

			<view v-if="order.payTime" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					支付时间
				</view>
				<view class="publish-content fo-24 text-right">
					{{ formatDateUTC(order.payTime, 'yyyy/MM/dd hh:mm')  }}
				</view>
			</view>

			<view v-if="order.sendTime" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					接单时间
				</view>
				<view class="publish-content fo-24 text-right">
					{{ formatDateUTC(order.sendTime, 'yyyy/MM/dd hh:mm')  }}
				</view>
			</view>

			<view v-if="order.getTime" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					配送完成
				</view>
				<view class="publish-content fo-24 text-right">
					{{ formatDateUTC(order.getTime, 'yyyy/MM/dd hh:mm')  }}
				</view>
			</view>

			<view v-if="order.successTime" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					完成时间
				</view>
				<view class="publish-content fo-24 text-right">
					{{ formatDateUTC(order.successTime, 'yyyy/MM/dd hh:mm')  }}
				</view>
			</view>

			<view v-if="order.closeTime" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					交易关闭时间
				</view>
				<view class="publish-content fo-24 text-right">
					{{ formatDateUTC(order.closeTime, 'yyyy/MM/dd hh:mm')  }}
				</view>
			</view>

			<view v-if="order.cancelTime" class="flex flex-between item-center mt-24">
				<view class="publish-label fo-24 ">
					取消时间
				</view>
				<view class="publish-content fo-24 text-right">
					{{ formatDateUTC(order.cancelTime, 'yyyy/MM/dd hh:mm')  }}
				</view>
			</view>

		</dd-card>
		<view v-if="order.status < 4 && order.status > -1">
			<view style="height: 120rpx;">
			</view>
			<view class="fixed-bottom">
				<RiderPanel v-if="isRider" :no="order.orderNo" :status="order.status" @refresh="getDetail(order.orderNo)" />
				<UserPanel v-else :no="order.orderNo" :status="order.status" @refresh="getDetail(order.orderNo)" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		$get
	} from '../../../util/request.js';
	import AddressShow from '../../../components/classic/AddressPicker/AddressShow.vue';
	import UserPanel from '@/components/classic/Order/UserPanel.vue';
	import RiderPanel from '@/components/classic/Order/RiderPanel.vue';
	import {
		formatDate,
		formatDateUTC
	} from '../../../util/date.js'
	export default {
		components: {
			AddressShow,
			UserPanel,
			RiderPanel
		},
		data() {
			return {
				order: {},
				rider: {},
				isRider: false,
				isLoad: false,
				orderNo: ''
			};
		},
		onLoad(options) {
			if(options.isRider){
				this.isRider = true;
			}
			this.orderNo = options.orderNo;
			this.getDetail(options.orderNo);
		},
		onShow() {
			if(this.isLoad){
				this.getDetail(this.orderNo);
			}
		},
		methods: {
			phoneClick() {
				uni.makePhoneCall({
					phoneNumber: this.rider.mobileNumber
				})
			},
			async getDetail(orderNo) {
				
				uni.showLoading({
					title: '加载中'
				})
				const order = await $get('order/detail', {
					orderNo
				})

				if (order.code === 200) {
					this.order = order.data;
					if (this.order.riderNo) {
						await this.getRider(this.order.riderNo)
					}
				}
				this.isLoad = true;
				uni.hideLoading()
			},
			async getRider(riderNo) {
				const rider = await $get('order/detail/rider', {
					riderNo
				});
				if (rider.code === 200) {
					this.rider = rider.data
				}

			},
			formatDate,
			formatDateUTC
		}
	}
</script>

<style lang="scss" scoped>
	.publish-label {
		width: 120rpx;
	}

	.publish-content {
		width: 480rpx;
	}

	.rider-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 60rpx;
		background-color: #f3f3f3;

		.iconfont {
			font-size: 36rpx;
			line-height: 60rpx;
			text-align: center;
			color: #666666;
		}
	}
	.fixed-bottom{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		height: 120rpx;
		background-color: #ffffff;
		box-shadow: 1rpx 0 10rpx 5rpx rgba($color: #000000, $alpha: 0.05);
	}
</style>
