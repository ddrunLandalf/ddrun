<template>
	<view  class="coupon-modal" @click="$store.commit('home/setUnreadCoupons',[])">
		<view class="coupon-container">
			<view class="coupon-title-bar">
				恭喜获得
			</view>
			<view class="coupon-content">
				<view v-for="(item,index) in coupons" :key="index" class="coupon-item">
					<view class="dot-line">
					</view>
					<view class="dot dot-left">
					</view>
					<view class="dot dot-right">
					</view>
					
					<view class="coupon-item-title">
						{{item.couponName}}
					</view>
					<view class="coupon-item-price">
						{{item.discountAmount}} <text class="fo-24">元</text>
					</view>
					<view class="coupon-item-condition">
						<text v-if="item.conditionsAmount === 0">无使用限制</text>
						<text v-else>满{{item.conditionsAmount}}元 减{{item.discountAmount}}元</text>
					</view>
					
					<view class="coupon-item-footer fo-9 fo-24">
						<text v-if="item.deadlineTime === '-1'">无时间限制</text>
						<text v-else>{{item.deadlineText}}</text>
					</view>
					
				</view>
			</view>
			<view class="coupon-footer text-center fo-28 fo-9">
				券已放入 “我的-优惠券”
			</view>
		</view>
	</view>
</template>

<script>
	import {$get} from '@/util/request.js'
	export default {
		
		computed: {
			coupons(){
				return this.$store.state.home.unreadCoupons
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-modal{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba($color: #000000, $alpha: 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		.coupon-container{
			width: 600rpx;
			background-color: rgba($color: #ffffff, $alpha: 1.0);
			border-radius: 20rpx;
			position: relative;
			.coupon-title-bar{
				width: 300rpx;
				height: 80rpx;
				border-radius: 8rpx;
				background-color: #c4a26b;
				position: absolute;
				top: -40rpx;
				line-height: 80rpx;
				text-align: center;
				left: 150rpx;
				color: #ffffff;
				font-size: 36rpx;
			}
			.coupon-footer{
				padding: 40rpx;
			}
			.coupon-content{
				padding:70rpx 40rpx 40rpx 40rpx;
				background-color: #e5cca0;
				border-radius: 20rpx 20rpx 0 0;
				.coupon-item{
					height: 220rpx;
					background-color: #ffffff;
					position: relative;
					margin-bottom: 30rpx;
					
					&:last-child{
						margin-bottom: 0rpx;
					}
					.dot{
						width: 30rpx;
						height: 30rpx;
						background-color: #e5cca0;
						border-radius: 30rpx;
						position: absolute;
						bottom: 60rpx;
					}
					.dot-line{
						width: 100%;
						position: absolute;
						left: 0;
						bottom: 75rpx;
						height: 1rpx;
						border-bottom: 1rpx dotted #e1e1e1;
					}
					.dot-left{
						left: -15rpx;
					}
					.dot-right{
						right: -15rpx
					}
					
					.coupon-item-title{
						position: absolute;
						font-size: 28rpx;
						left: 30rpx;
						top: 30rpx;
					}
					
					.coupon-item-price{
						position: absolute;
						font-size: 32rpx;
						right: 30rpx;
						top: 30rpx;
					}
					
					.coupon-item-condition{
						font-size: 24rpx;
						line-height: 44rpx;
						border-radius: 44rpx;
						padding: 0 20rpx;
						background-color: #c4a26b;
						color: #ffffff;
						position: absolute;
						left: 30rpx;
						top: 80rpx;
					}
					.coupon-item-footer{
						position: absolute;
						left: 30rpx;
						bottom: 16rpx;
					}
				}
			}
		}
	}
</style>
