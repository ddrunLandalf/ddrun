<template>
	<view class="loader"></view>
</template>

<script>
export default {
	
}
</script>

<style scoped>
	.loader {
	  width: 48rpx;
	  height: 48rpx;
	  display: block;
	  margin: 20rpx auto;
	  box-sizing: border-box;
	  position: relative;
	}
	.loader::after {
	  content: '';  
	  box-sizing: border-box;
	  width: 48rpx;
	  height: 48rpx;
	  left: 0;
	  bottom: 0;
	  position: absolute;
	  border-radius: 50% 50% 0;
	  border: 15rpx solid #aaa;
	  transform: rotate(45deg) translate(0, 0);
	  box-sizing: border-box;
	  animation: animMarker 0.4s ease-in-out infinite alternate;
	}
	.loader::before {
	  content: '';  
	  box-sizing: border-box;
	  position: absolute;
	  left: 0;
	  right: 0;
	  margin: auto;
	  top: 150%;
	  width: 24rpx;
	  height: 4rpx;
	  border-radius: 50%;
	  background: rgba(0, 0, 0, 0.2);
	  animation: animShadow 0.4s ease-in-out infinite alternate;
	}
	
	@keyframes animMarker {
	  0% {
	    transform: rotate(45deg) translate(5rpx, 5rpx);
	  }
	  100% {
	    transform: rotate(45deg) translate(-5rpx, -5rpx);
	  }
	}
	
	@keyframes animShadow {
	  0% {
	    transform: scale(0.5);
	  }
	  100% {
	    transform: scale(1);
	  }
	}
</style>
