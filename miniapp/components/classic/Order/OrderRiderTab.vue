<template>
	<view >
		<view class="rider-tab">
			<view class="flex flex-center">
				<view v-for="(item,index) in tabs" :key="index" :class="['tab-item', value === index ? 'tab--active':'']"
					@click="$emit('change',index)">
					{{item.label}}
				</view>
			</view>
			<view class="slider" :style="{left: (75 + value*250) + 'rpx'}">
			</view>
		</view>
		<view style="height: 100rpx;"> </view>
	</view>
</template>

<script>
	export default {
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			value: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				tabs: [
					{
						label: '待接单',
					}, {
						label: '配送中',
					},
					{
						label: '历史订单',
					}
				]
			}
		}
	}
</script>

<style lang="scss" scope>
	.rider-tab {
		position: fixed;
		width: 750rpx;
		top: 0;
		height: 100rpx;
		box-shadow: 2rpx 0 5rpx 5rpx rgba(0, 0, 0, 0.05);
		background-color: #ffffff;

		.tab-item {
			width: 33.33%;
			height: 98rpx;
			line-height: 98rpx;
			font-size: 28rpx;
			text-align: center;
			color: #666666;
		}

		.tab--active {
			font-weight: bold;
			color: #333333;
		}

		.slider {
			width: 100rpx;
			height: 4rpx;
			border-radius: 4rpx;
			background-color: #333;
			position: relative;
			left: 75rpx;
			transition: left .2s linear;
		}
	}
</style>
