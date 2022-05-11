<template>
	<view class="p-30">
		<view class="rider-panel flex flex-start flex-wrap rider-panel-t">
			<view class="rider-data-item">
				<view class="fo-32 fo-w">
					{{balance}}元
				</view>
				<view class="fo-24 fo-w mt-8">
					余额
				</view>
			</view>
			<view class="rider-data-item">
				<view class="fo-32 fo-w">
					{{accumulatedCash}}元
				</view>
				<view class="fo-24 fo-w mt-8">
					已提现
				</view>
			</view>
			<view class="rider-data-item">
				<view class="fo-32 fo-w">
					{{accumulatedIncome}}元
				</view>
				<view class="fo-24 fo-w mt-8">
					累计收入
				</view>
			</view>
		</view>

		<view class="rider-panel flex flex-start flex-wrap rider-panel-i mt-32">
			<view class="rider-data-item">
				<view class="fo-32 fo-w">
					{{todayTotal}}单
				</view>
				<view class="fo-24 fo-w mt-8">
					今日成单
				</view>
			</view>
			<view class="rider-data-item">
				<view class="fo-32 fo-w">
					{{monthTotal}}单
				</view>
				<view class="fo-24 fo-w mt-8">
					本月成单
				</view>
			</view>
			<view class="rider-data-item">
				<view class="fo-32 fo-w">
					{{allTotal}}单
				</view>
				<view class="fo-24 fo-w mt-8">
					累计成单
				</view>
			</view>
		</view>

		<dd-card margin="30rpx 0 0 0">
			<navigator class="p-30 flex flex-between item-center border-b-none" url="/pages/rider/cash/cash">
				<view class="flex flex-start item-center">
					<view class="iconfont icon-cash fo-28">
					</view>
					<view class="ml-30 fo-28">
						提现
					</view>
				</view>
				<view class="iconfont icon-arrow-right fo-28 fo-9">
				</view>
			</navigator>
			<navigator class="p-30 flex flex-between item-center" url="/pages/text/text?type=rider">
				<view class="flex flex-start item-center">
					<view class="iconfont icon-guide fo-28">
					</view>
					<view class="ml-30 fo-28">
						骑手指南
					</view>
				</view>
				<view class="iconfont icon-arrow-right fo-28 fo-9">
				</view>
			</navigator>
		</dd-card>

		<dd-card margin="30rpx 0 0 0">
			<navigator class="p-30 flex flex-between item-center border-b-none" url="/pages/rider/setting/setting">
				<view class="flex flex-start item-center">
					<view class="iconfont icon-setting fo-28">
					</view>
					<view class="ml-30 fo-28">
						骑手设置
					</view>
				</view>
				<view class="iconfont icon-arrow-right fo-28 fo-9">
				</view>
			</navigator>
			<navigator class="p-30 flex flex-between item-center" url="/pages/rider/status/status">
				<view class="flex flex-start item-center">
					<view class="iconfont icon-status fo-28">
					</view>
					<view class="ml-30 fo-28">
						骑手状态
					</view>
				</view>
				<view class="iconfont icon-arrow-right fo-28 fo-9">
				</view>
			</navigator>
		</dd-card>

		<dd-card margin="30rpx 0 0 0">
			<navigator class="p-30 flex flex-between item-center " @click="changeToUser">
				<view class="flex flex-start item-center">
					<view class="iconfont icon-change fo-28">
					</view>
					<view class="ml-30 fo-28">
						{{ userVersion === 'rider' ? '切换为用户版':'切换为骑手版'}}
					</view>
				</view>
				<view class="iconfont icon-arrow-right fo-28 fo-9">
				</view>
			</navigator>
		</dd-card>

	</view>
</template>

<script>
	import {$get} from '../../util/request.js'
	export default {
		data() {
			return {
				accumulatedIncome: 0,
				accumulatedCash: 0,
				balance: 0,
				todayTotal:0, 
				monthTotal:0, 
				allTotal:0,
				userVersion: uni.getStorageSync('userVersion') || 'user'
			};
		},
		onLoad() {
				this.getData()
		},
		methods: {
			async getData(){
				uni.showLoading()
				const res = await $get('rider/analysis')
				if(res.code === 200){
					this.accumulatedIncome = res.data.accumulatedIncome;
					this.accumulatedCash = res.data.accumulatedCash;
					this.balance = res.data.balance;
					this.todayTotal = res.data.todayTotal;
					this.monthTotal = res.data.monthTotal;
					this.allTotal = res.data.allTotal;
				}
				uni.hideLoading()
			},
			changeToUser() {
				const isRider = uni.getStorageSync('userVersion') === 'rider'
				if (isRider) {
					uni.setStorageSync('userVersion', 'user');
					uni.navigateBack({
						delta: 1,
						success() {
							uni.redirectTo({
								url: '/pages/index/index',
							})
						}
					})

				} else {
					uni.setStorageSync('userVersion', 'rider');
					uni.navigateBack({
						delta: 1,
						success() {
							uni.redirectTo({
								url: '/pages/rider/order/order',
							})
						}
					})
					
				}
			}
		}
	}
</script>

<style lang="scss" scope>
	.rider-panel {
		border-radius: 8rpx;

		.rider-data-item {
			width: 33%;
			text-align: center;
			padding: 30rpx 0;
		}
	}

	.rider-panel-t {
		background-color: $color-theme;
	}

	.rider-panel-i {
		background-color: $color-info;
	}
</style>
