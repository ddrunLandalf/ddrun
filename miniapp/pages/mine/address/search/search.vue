<template>
	<view class="search-address">
		<view class="fix-top border-b flex flex-between item-center">
			<view class="flex flex-start item-center" @click="chooseCity">
				<view class="city-text fo-26 ell">
					{{ currentCity }}
				</view>
				<view class="iconfont icon-arrow-bottom fo-24 fo-9 ml-12">
				</view>
			</view>
			<view class="search-content flex flex-start item-center">
				<view class="iconfont icon-search fo-32 fo-9 ml-24">
				</view>
				<input v-model="keyword" class="search-input ml-24" type="text" :auto-focus="true" placeholder="输入关键字搜索地址"
					placeholder-class="fo-9 fo-28" @input="keywordInput" />
			</view>
		</view>
		<view style="height: 140rpx;"></view>
		<view class="px-30">
			<view v-if="loading" class="mt-24">
				<loading-location />
			</view>
			<view v-for="(item,index) in list" :key="index" class="py-30 border-b" @click="chooseAddress(index)">
				<view class="fo-28 fo-3">
					{{item.title}}
				</view>
				<view class="fo-24 fo-9">
					{{item.address}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		$get
	} from '../../../../util/request.js'
	export default {
		data() {
			return {
				currentCity: '',
				keyword: '',
				list: [],
				loading: false
			};
		},
		mounted() {
			this.currentCity = uni.getStorageSync('currentCity')
		},
		methods: {
			chooseCity() {
				uni.navigateTo({
					url: '/pages/mine/address/city/city'
				})
			},
			async keywordInput(e) {
				this.loading = true;
				const value = e.detail.value;
				const result = await $get('map/location/search', {
					cityName: this.currentCity,
					keyword: value,
					pageSize: 15
				});
				this.loading = false;
				if (result.code === 200) {
					this.list = result.data;
				}
			},
			async chooseAddress(index) {
				uni.showLoading({
					title: '加载中'
				})
				const res = this.list[index];
				const result = await $get('map/location', {
					latitude: res.location.lat,
					longitude: res.location.lng
				})
				uni.hideLoading();
				if(result.code === 200){
					const pages = getCurrentPages();
					const page = pages[pages.length - 2]
					page.$vm.formData.province = result.data.province;
					page.$vm.formData.city = result.data.city;
					page.$vm.formData.district = result.data.district;
					page.$vm.formData.streetNumber = result.data.street_number;
					page.$vm.formData.latitude = result.data.latitude;
					page.$vm.formData.longitude = result.data.longitude;
					// page.$vm.$forceUpdate();
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.search-address {
		.fix-top {
			position: fixed;
			top: 0;
			left: 0;
			width: 690rpx;
			padding: 30rpx;
			background-color: #ffffff;
		}

		.city-text {
			width: 90rpx;
			text-align: right;
		}

		.search-content {
			width: 540rpx;
			height: 80rpx;
			background-color: #f3f3f3;
			border-radius: 8rpx;

			.search-input {
				width: 460rpx;
				line-height: 80rpx;
			}
		}
	}
</style>
