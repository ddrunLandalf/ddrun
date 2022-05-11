<template>
	<view class="city">
		<scroll-view scroll-y="true" :scroll-into-view="scrollIntoView" :scroll-with-animation="true">
			<view class="px-30" id="top">
				<view class="py-30 border-b fo-28">
					当前选择: {{currentCity || '--- ---'}}
				</view>
				<view class="py-30">
					<view class="mb-32" v-if="locationCity">
						<view class="fo-28 fo-9">
							定位城市
						</view>
						<view class="city-item fo-28 mt-24" @click="changeCurrentCity(locationCity)">
							<text class="iconfont icon-location fo-28 mr-8 fo-info"></text> {{locationCity}}
						</view>
					</view>

					<view class="fo-28 fo-9 ">
						热门城市
					</view>
					<view class="flex flex-start item-center flex-wrap">
						<view v-for="(item,index) in hotCity" :key="index" class="city-item fo-28 mt-24 mr-20"
							@click="changeCurrentCity(item.name)">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			<!-- 城市列表 -->
			<view v-for="(item,index) in cityData" :key="index" :id="item.name">
				<view class="letters">
					{{item.name}}
				</view>
				<view v-for="(city,cityIndex) in item.cities" :key="cityIndex" class="p-30 border-b fo-28"
					@click="changeCurrentCity(city.name)">
					{{city.name}}
				</view>
			</view>
			<view class="bar-fixed flex flex-center item-center">
				<view class="right-bar">
					<view v-for="(item,index) in letters" :key="index" class="right-bar-item fo-9"
						@touchmove="changeScroll(item)" @click="changeScroll(item)">
						{{item}}
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		cityData
	} from '../../../../util/city.js'
	import {
		$get
	} from '../../../../util/request.js'
	export default {
		data() {
			return {
				letters: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T',
					'W', 'X', 'Y', 'Z'
				],
				hotCity: [{
					name: '杭州市'
				}, {
					name: '北京市'
				}, {
					name: '上海市'
				}, {
					name: '宁波市'
				}, {
					name: '重庆市'
				}, {
					name: '广州市'
				}, {
					name: '深圳市'
				}, {
					name: '武汉市'
				}],
				cityData,
				scrollIntoView: '',
				// 定位城市
				locationCity: '',
				// 当前城市
				currentCity: '',
				type: ''
			}
		},
		onLoad(event) {
			this.type = event.type;
		},
		mounted() {
			this.currentCity = uni.getStorageSync('currentCity');
			uni.getLocation({
				type: 'gcj02',
				complete: async (res) => {
					if (res.errMsg === 'getLocation:ok') {
						const result = await $get('map/location', {
							latitude: res.latitude,
							longitude: res.longitude
						});
						if (result.code === 200) {
							this.locationCity = result.data.city
						}
					}
				}
			})
		},
		methods: {
			changeScroll(val) {
				if (val = '#') {
					val = 'top'
				}
				this.scrollIntoView = val
			},
			changeCurrentCity(val) {
				uni.setStorageSync('currentCity', val);
				if(this.type === 'home'){
					const pages = getCurrentPages();
					const page = pages[pages.length - 2];
					page.$vm.getCityData(val)
				}
				uni.navigateBack({
					delta: 1
				})
			}

		}
	}
</script>

<style lang="scss">
	.city {
		.city-item {
			width: 190rpx;
			height: 70rpx;
			background-color: #f3f3f3;
			line-height: 70rpx;
			text-align: center;
			border-radius: 8rpx;
		}

		.bar-fixed {
			position: fixed;
			right: 20rpx;
			height: 100vh;
			top: 0;
		}

		.right-bar {
			width: 40rpx;
			min-height: 300rpx;
			background-color: #f7f7f7;
			border-radius: 40rpx;

			.right-bar-item {
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				line-height: 40rpx;
				font-size: 26rpx
			}

			.right-bar-item:first-child {
				margin-top: 10rpx
			}

			.right-bar-item:last-child {
				margin-bottom: 10rpx
			}
		}

		.letters {
			padding: 0 30rpx;
			font-size: 24rpx;
			line-height: 50rpx;
			background-color: #f3f3f3;
		}
	}
</style>
