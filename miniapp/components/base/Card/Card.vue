<template>
	<view class="card" :style="{padding,width,margin}" @click="$emit('click')">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			padding: {
				type: String,
				default: ''
			},
			width: {
				type: String,
				default: '100%'
			},
			margin: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.card {
		background-color: #ffffff;
		border-radius: 8rpx;
		box-shadow: 0 0 20rpx 10rpx rgba($color: #000000, $alpha: 0.05);
	}
</style>
