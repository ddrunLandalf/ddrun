<template>
	<view class="login-container flex flex-center item-center">
		<view class="p-30">
			<view class="text-center fo-50" style="margin-bottom: 160rpx;">
				微信手机号码
			</view>
			<!-- <ClassicBtn label="一键登录" width="690rpx"  /> -->
			<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" >一键登录/注册</button>
			<!-- <view class="mt-24 text-center fo-28 login-text">
				手机号码登录/注册
			</view> -->
		</view>
	</view>
</template>

<script>
	import ClassicBtn from '../../components/classic/Button/ClassicButton.vue'
	import { post } from '../../util/request.js'
	export default {
		components: {
				ClassicBtn
		},
		data() {
			return {
				
			};
		},
		methods: {
			async getPhoneNumber(event){
				console.log(event)
				if(event.detail.errMsg === 'getPhoneNumber:ok'){
					const {code} = event.detail;
					const result = await post('wxapp/register',{
						code
					});
					if(result.code === 200){
						uni.setStorageSync('userInfo', result.data)
						uni.navigateBack({
							delta: 1
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
.login-container{
	width: 100vw;
	height: 90vh;
	.login-btn{
		width: 690rpx;
		height: 100rpx;
		line-height: 100rpx;
		background-color: $color-theme;
		color: #ffffff;
		&:active{
			opacity: 0.8;
		}
	}
}
.login-text{
	color: $color-info;
}
</style>
