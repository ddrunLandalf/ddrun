<template>
	<view class="rider-status flex flex-center item-center">
		<view>
			<view class="text-center">
				<view v-if="status === 0" class="iconfont icon-verify-wait"></view>
				<view v-else-if="status === 1" class="iconfont icon-verify-success"></view>
				<view v-else class="iconfont icon-verify-refuse"></view>
			</view>

			<view class="text-center fo-40 mt-24" v-if="status === 2">审核失败</view>
			<view class="text-center fo-40 mt-24" v-else-if="status === 0">待审核</view>
			<view class="text-center fo-40 mt-24" v-else>已通过审核</view>

			<view class="text-center fo-28 fo-9 mt-24" v-if="status === 2">请修改并重新提交资料</view>
			<view class="text-center fo-28 fo-9 mt-24" v-else-if="status === 0">工作人员将在1-3个工作日内审核完成</view>
			<view class="text-center fo-28 fo-9 mt-24" v-else>{{updateTime}}</view>

			<view class="p-30 text-center" v-if="status === 2">
				<view class="fo-24 fo-6">未通过原因</view>
				<view class="fo-24 fo-6">{{reason}}</view>
				<button class="mt-24" size="mini" @click="goUpdate">去修改</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {$get} from '@/util/request.js'
	import {formatDateUTC} from '@/util/date.js'
	export default {
		data() {
			return {
				status: 0,
				reason: '',
				updateTime: ''
			};
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			goUpdate(){
				uni.redirectTo({
					url: '/pages/rider/register/register'
				})
			},
			async getInfo(){
				uni.showLoading()
				const res = await $get('rider/register/info');
				if(res.code === 200){
					this.status = res.data.status;
					this.reason = res.data.refuseReason;
					this.updateTime = formatDateUTC(res.data.updateTime, 'yyyy-MM-dd');
				}
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss" scope>
	.rider-status {
		width: 750rpx;
		height: 80vh;

		.iconfont {
			font-size: 100rpx;
		}

		.icon-verify-wait {
			color: $color-info;
		}
		.icon-verify-success {
			color: $color-green;
		}
		.icon-verify-refuse{
			color: $color-price
		}
	}
</style>
