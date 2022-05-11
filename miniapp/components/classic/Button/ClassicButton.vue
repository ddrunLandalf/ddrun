<template>
	<view class="classic-button" :style="{width}" @click="$emit('click')">
		{{label}}
	</view>
</template>

<script>
	export default {
		props:{
			label: {
				type: String,
				default: ''
			},
			width: {
				type: String,
				default: '100%'
			}
		}
	}
</script>

<style lang="scss">
	.classic-button{
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		border-radius: 8rpx;
		background-color: $color-theme;
		color: #FFFFFF;
		
		&:hover{
			opacity: 0.8;
		}
	}
</style>
