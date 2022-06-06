<template>
	<button class="mine-btn" type="default" open-type="getUserInfo"  @click="type === 'rider' ? riderClick(): getProfile()">
		<view class="mine-button" >
			<view :class="['iconfont' ,'icon-'+type]"></view>
		</view>
	</button>
</template>

<script>
	import { post, info } from '../../../util/request.js'
	export default {
		props: {
			type: {
				type: String,
				default: 'user'
			}
		},
		methods:{
			navToMine(){
				uni.navigateTo({
					url: '/pages/mine/mine'
				})
			},
			riderClick(){
				uni.navigateTo({
					url: '/pages/rider/rider'
				})
			},
			getProfile(){
				const userInfo = uni.getStorageSync('userInfo');
				if((userInfo && !userInfo.avatarUrl) || !userInfo){
					uni.getUserProfile({
						lang: 'zh_CN',
						desc: '展示用户头像',
						complete: async (up) => {
							if(up.userInfo){
								const res = await post('user/update', {
									avatarUrl: up.userInfo.avatarUrl, 
									city:up.userInfo.city, 
									province: up.userInfo.province, 
									gender: up.userInfo.gender, 
									nickName: up.userInfo.nickName
								})
								if(res.code === 200){
									await info()
								}
								this.navToMine()
							}
							
						}
					})
				} else {
					this.navToMine()
				}
			},
			async getUserInfo(e){
				const userInfo = uni.getStorageSync('userInfo');
				if((userInfo && !userInfo.avatarUrl) || !userInfo){
					if(e.detail.errMsg === 'getUserInfo:ok'){
						const { avatarUrl, city, province, gender, nickName } = e.detail.userInfo;
						uni.showLoading()
						const res = await post('user/update', {
							avatarUrl, city, province, gender, nickName
						})
						if(res.code === 200){
							await info()
						}
					}
				}
				this.navToMine()
			}
		}
	}
</script>

<style lang="scss">
	.mine-btn{
		
	}
	.mine-button{
		position: fixed;
		right: 0;
		top: 100rpx;
		height: 100rpx;
		width: 100rpx;
		border-radius: 50rpx 0 0 50rpx;
		box-shadow: 0 0 20rpx 10rpx rgba($color: #000000, $alpha: 0.05);
		background-color: #ffffff;
		&:hover{
			opacity: 0.8;
		}
		.iconfont{
			line-height: 100rpx;
			text-align: center;
		}
	}
</style>
