<template>
	<view class="address-item border-b flex flex-between item-center" @click="chooseAddress">
		<view class="address-content">
			<view class="fo-28 fo-3 bold">
				{{formatDateUTC(options.updateTime, 'yyyy/MM/dd hh:mm')}}
			</view>
			<view class="fo-28 fo-9 mt-8">
				{{options.province}}{{options.city}}{{options.district}}{{options.addressDetail}}
			</view>
			<view class="fo-28 fo-9 mt-8">
				{{options.mobileNumber}} {{options.contactName}}
			</view>
		</view>
		<view class="address-icon" @click.stop="navToSupply()">
			<view class="iconfont icon-edit fo-32 fo-9"></view>
		</view>
	</view>
</template>

<script>
	import {
		formatDateUTC
	} from '../../../util/date.js'
	export default {
		props: {
			options: {
				type: Object,
				default: {}
			},
			type: {
				type: String,
				default: '' // start or end
			}
		},
		methods: {
			formatDateUTC,
			navToSupply() {
				uni.navigateTo({
					url: `/pages/mine/address/supply/supply?type=update&address=${this.options.province ? JSON.stringify(this.options):''}`
				})
			},
			chooseAddress(){
				if(this.type){
					const method = this.type === 'start' ? 'home/setStartAddress' : 'home/setEndAddress'
					this.$store.commit(method, this.options);
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-item {
		padding: 30rpx;
		padding-right: 0;

		.address-content {
			width: 598rpx;
		}

		.address-icon {
			padding: 0 30rpx;
			border-left: 1rpx solid #e1e1e1;
		}
	}
</style>
