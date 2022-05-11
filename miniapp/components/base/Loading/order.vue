<template>
	<view class="loader">
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.loader {
	    position: relative;
	    width: 100rpx;
	    height: 130rpx;
	    background: #f3f3f3;
	    border-radius: 4rpx;
		margin: auto;
	  }
	  .loader:before{
	    content: '';
	    position: absolute;
	    width: 54rpx;
	    height: 25rpx;
	    left: 50%;
	    top: 0;
	    background-image:
	    radial-gradient(ellipse at center, #0000 24%,$color-info 25%,$color-info 64%,#0000 65%),
	    linear-gradient(to bottom, #0000 34%,$color-info 35%);
	    background-size: 12rpx 12rpx , 100% auto;
	    background-repeat: no-repeat;
	    background-position: center top;
	    transform: translate(-50% , -65%);
	    box-shadow: 0 -3rpx rgba(0, 0, 0, 0.25) inset;
	  }
	 .loader:after{
	    content: '';
	    position: absolute;
	    left: 50%;
	    top: 20%;
	    transform: translateX(-50%);
	    width: 66%;
	    height: 60%;
	    background: linear-gradient(to bottom, #f79577 30%, #0000 31%);
	    background-size: 100% 16rpx;
	    animation: writeDown 2s ease-out infinite;
	 }
	
	 @keyframes writeDown {
	    0% { height: 0%; opacity: 0;}
	    20%{ height: 0%; opacity: 1;}
	    80% { height: 65%; opacity: 1;}
	    100% { height: 65%; opacity: 0;}
	 }
	      
</style>
