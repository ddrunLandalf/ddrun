<template>
	<view class="p-30">
		<view class="fo-50">请输入手机号码</view>
		<view class="fo-9 fo-28 mt-12 pb-30">为了方便联系，请输入您的常用手机号码</view>

		<input v-model="phoneNumber" class="fo-40 border-b mt-30 h-100" maxlength="11" type="number"
			placeholder="输入11位手机号码"></input>

		<view class="flex flex-between mt-24 border-b">
			<input v-model="verifyCode" class="fo-40  h-100 " placeholder="输入验证码"></input>
			<view :class="[showCode ? 'bg-none fo-9':'bg-t fo-w', 'getcode-btn']" @click="showCode ? '':getCode()">
				{{showCode ? second+'s':'获取验证码'}}</view>
		</view>

		<view class="py-30 mt-30">
			<ClassicBtn label="登录 / 注册" @click="submit()" />
		</view>

		
	</view>
</template>

<script>
	import {post} from '@/util/request.js'
	import ClassicBtn from '@/components/classic/Button/ClassicButton.vue'
	export default {
		components: {
			ClassicBtn
		},
		data() {
			return {
				phoneNumber: '',
				verifyCode: '',
				second: 60,
				intv: null,
				showCode: false
			}
		},
		beforeDestroy(){
			this.clearIntv()
		},
		methods: {
			clearIntv(){
				clearInterval(this.intv)
				this.second = 60;
				this.showCode = false
			},
			setIntv(){
				this.showCode = true
				this.intv = setInterval(()=> {
					this.second --;
					if(this.second === 0){
						this.clearIntv()
					}
				}, 1000)
			},
			async submit() {
				if(!this.phoneNumber){
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 800
					})
					return;
				}else if(!this.verifyCode){
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						duration: 800
					})
					return;
				}
				uni.showLoading({
					title: '登录中'
				})
				const result = await post('user/register', {
					mobileNumber: this.phoneNumber,
					verifyCode: this.verifyCode
				});
				uni.hideLoading()
				if(result.code === 200){
					this.clearIntv();
					uni.setStorageSync('userInfo', result.data.user);
					uni.navigateBack({
						delta: 1
					})
				}
			},
			async getCode() {
				if(!this.phoneNumber){
					uni.showToast({
						title: '请先输入手机号',
						icon: 'none',
						duration: 800
					})
					return;
				}
				uni.showLoading({
					title: '获取中'
				})
				const result = await post('sms/code', {
					mobileNumber: this.phoneNumber
				});
				uni.hideLoading()
				if(result.code === 200){
					this.clearIntv();
					this.setIntv()
				}
			}
		}
	}
</script>

<style>
.getcode-btn{
  width: 200rpx;
  height: 80rpx;
  font-size: 26rpx;
  line-height: 80rpx;
  text-align: center;
  color: #ffffff;
  border-radius: 8rpx;
}
</style>
