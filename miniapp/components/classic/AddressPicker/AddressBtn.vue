<template>
	<view class="address-item">
		<view v-if="type === 'radio'" class="flex flex-center item-center">
			<view :class="['radio-tag mr-24', buyStyle === 'nearby' ? 'radio-tag--active':'']"
				@click="changeRadio('nearby')">
				就近购买
			</view>
			<view :class="['radio-tag', buyStyle === 'appoint' ? 'radio-tag--active':'']"
				@click="changeRadio('appoint')">
				指定地点购买
			</view>
		</view>
		<view class=" flex flex-between item-center">
			<dot :color="dot" />
			<view :class="['address-item-content flex flex-between item-center', borderT ? 'border-t':'']">
				<view class="content-input" @click="type === 'radio' && buyStyle === 'nearby' ? null: $emit('click')">
					<view v-if="type === 'radio' && buyStyle === 'nearby'" class="placeholder ">
						{{buyPlaceholder}}
					</view>
					<view v-else-if="address.province">
						<view class="fo-32 fo-3 ell">
							{{address.addressDetail}}
						</view>
						<view class="fo-9 fo-24">
							{{address.contactName || '请填写联系人'}} {{address.mobileNumber || ''}}
						</view>
					</view>
					<view v-else class="placeholder">
						{{type === 'default' ? placeholder: buyPlaceholder}}
					</view>
				</view>
				<view class="flex flex-end item-center">
					<view class="vertical-line"> </view>
					<view class="choose-btn" @click="navToAddress">
						常用
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			borderT: {
				type: Boolean,
				default: false
			},
			dot: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: '请选择一个地址'
			},
			address: {
				type: Object,
				default: () => {
					return {}
				}
			},
			type: {
				type: String,
				default: 'default' // radio
			},
			point: {
				type: String,
				default: 'start' // end
			}
		},

		computed: {
			buyStyle() {
				return this.$store.state.home.buyStyle
			},
			buyPlaceholder() {
				return this.buyStyle === 'nearby' ? '就近购买' : '请指定一个地址购买'
			}
		},
		methods: {
			changeRadio(type) {
				this.$store.commit('home/setBuyStyle', type);
			},
			navToAddress(){
				uni.navigateTo({
					url: '/pages/mine/address/address?type='+this.point
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-item {
		min-height: 100rpx;

		.radio-tag {
			padding: 15rpx 30rpx;
			margin-right: 20rpx;
			border-radius: 100rpx;
			font-size: 24rpx;
			margin-bottom: 20rpx;
			background-color: #e3e7ea;
			color: #999999;
		}

		.radio-tag--active {
			background-color: $color-info;
			color: #ffffff;
		}

		.address-item-content {
			width: 574rpx;
			margin-left: 30rpx;
			min-height: 100rpx;

			.vertical-line {
				height: 50rpx;
				width: 1rpx;
				border-left: 1px solid #e1e1e1;
			}

			.choose-btn {
				background-color: $color-theme;
				color: #ffffff;
				border-radius: 4rpx;
				width: 80rpx;
				line-height: 50rpx;
				text-align: center;
				height: 50rpx;
				font-size: 24rpx;
				margin-left: 16rpx;
				transition: .15s linear opacity;

				&:hover {
					opacity: 0.8;
				}
			}

			.content-input {
				width: 460rpx;
			}

			.placeholder {
				color: #aaaaaa;
				font-size: 40rpx;
			}
		}
	}
</style>
