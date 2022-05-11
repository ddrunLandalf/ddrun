<template>
	<view :class="['dot', 'dot-'+color]"></view>
</template>

<script>
	export default {
		props: {
			color: {
				type: String,
				default: 'green'
			}
		}
	}
</script>

<style lang="scss">
	.dot {
		width: 14rpx;
		height: 14rpx;
		border-radius: 12rpx;
	}
	
	.dot-green {
		border: 4rpx solid #90e9b6;
		background-color: $color-green;
	}
	
	.dot-orange {
		border: 4rpx solid #ffddcc;
		background-color: $color-info;
	}
</style>
