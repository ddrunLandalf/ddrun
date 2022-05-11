<template>
	<view class="address-config border-t border-b">
		<!-- 家 -->
		<view class="address-container flex flex-between item-center border-b" @click="chooseAddress('home')">
			<view class="iconfont icon-home fo-40 fo-9"> </view>
			<view class="address-content">
				<view class="fo-32 bold">
					家
				</view>
				<view v-if="home.province">
					<view class="fo-28 mt-16 fo-6 ell">
						{{home.province}}{{home.city}}{{home.district}}{{home.addressDetail}}
					</view>
					<view class="fo-28 mt-16 fo-6 ell">
						{{home.mobileNumber}} {{home.contactName}}
					</view>
				</view>
				<view v-else>
					<view  class="fo-28 mt-16 fo-9 ">
						设置家的地址
					</view>
					<view class="fo-28 mt-16 fo-9 ">
						设置联系方式
					</view>
				</view>
			</view>
			<view class="address-icon" @click.stop="navToSupply('home')">
				<view class="iconfont icon-edit fo-32 fo-9"></view>
			</view>
		</view>
		<!-- 企业 -->
		<view class="address-container flex flex-between item-center" @click="chooseAddress('company')">
			<view class="iconfont icon-company fo-40 fo-9"> </view>
			<view class="address-content">
				<view class="fo-32 bold">
					公司
				</view>
				<view v-if="company.province">
					<view class="fo-28 mt-16 fo-6 ell">
						{{company.province}}{{company.city}}{{company.district}}{{company.addressDetail}}
					</view>
					<view class="fo-28 mt-16 fo-6 ell">
						{{company.mobileNumber}} {{company.contactName}}
					</view>
				</view>
				<view v-else>
					<view class="fo-28 mt-16 fo-9">
						设置公司的地址
					</view>
					<view class="fo-28 mt-16 fo-9">
						设置联系方式
					</view>
				</view>
				
			</view>
			<view class="address-icon" @click.stop="navToSupply('company')">
				<view class="iconfont icon-edit fo-32 fo-9"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { $get } from '../../../util/request.js'
	export default {
		props: {
			home: {
				type: Object,
				default: {}
			},
			company: {
				type: Object,
				default: {}
			},
			type: {
				type: String,
				default: '' // start or end
			}
		},
		methods: {
			
			navToSupply(type){
				uni.navigateTo({
					url: `/pages/mine/address/supply/supply?type=${type}&address=${this.home.province ? JSON.stringify(this.home):''}`
				})
			},
			chooseAddress(type){
				if(this.type){
					const method = this.type === 'start' ? 'home/setStartAddress' : 'home/setEndAddress'
					this.$store.commit(method, this[type]);
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-config{
		padding-left: 30rpx;
		.address-container{
			padding:30rpx 0;
			.address-content{
				width: 528rpx;
			}
			.address-icon{
				padding: 0 30rpx;
				border-left: 1rpx solid #e1e1e1;
			}
		}
	}
</style>
