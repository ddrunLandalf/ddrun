<template>
	<view class="p-30">
		<AddressShow :type="serviceLabel" :start="start" :end="end" />
		<dd-card padding="0 30rpx" width="630rpx" margin="30rpx 0 0 0">
			<view class="py-30 border-b flex flex-between item-center">
				<view class="publish-label fo-28 bold">
					物品描述:
				</view>
				<view class="publish-content fo-28">
					{{ goodsDesc }}
				</view>
			</view>
			<view class="py-30 border-b flex flex-between item-center">
				<view class="publish-label fo-28 bold">
					配送路程:
				</view>
				<view class="publish-content fo-28">
					{{distanceLabel}}
				</view>
			</view>

			<view class="py-30 flex flex-between item-center">
				<view class="publish-label fo-28 bold">
					物品重量:
				</view>
				<view class="publish-content fo-28">
					{{weightLabel}}
				</view>
			</view>

		</dd-card>

		<dd-card padding="0 30rpx" width="630rpx" margin="30rpx 0 0 0">
			<view class="py-30 border-b flex flex-between item-center" @click="navToCoupon">
				<view class="publish-label fo-28 bold">
					<text space="nbsp">优 惠 券 :</text>
				</view>
				<view class="publish-content flex flex-between item-center">
					<view v-if="userCouponId === ''&& ableCoupons>0" class="fo-28">
						您有 <text class="fo-info bold">{{ableCoupons}}</text> 张可用优惠券
					</view>
					<view v-else-if="userCouponId === '' && ableCoupons===0 " class="fo-28 fo-9">
						暂无可用优惠券
					</view>
					<view v-else class="fo-28 fo-price">
						已优惠{{couponDiscount}}元
					</view>
					<view class="iconfont icon-arrow-right fo-28 fo-9"></view>
				</view>
			</view>

			<view class="py-30  flex flex-between item-center">
				<view class="publish-label fo-28 bold">
					<text>积分抵扣:</text>
				</view>
				<view class="publish-content fo-28 flex flex-between item-center" @click="doUseIntegral()">
					<view v-if="canChangeAmount > 0" class="fo-28">
						您可使用{{useIntegral}}积分,抵扣<text class="fo-info">{{canChangeAmount}}</text>元
					</view>
					<view v-else class="fo-28">
						您的积分不足于抵扣
					</view>
					<label>
						<checkbox :checked="useIntegralPay" :disabled="canChangeAmount === 0" />
					</label>
				</view>
			</view>
		</dd-card>

		<view class="fo-24 fo-9 mt-16">
			优惠券与积分只能选则一项
		</view>

		<picker @change="bindPickerChange" :value="tipCurrent" :range="feeTips">
			<dd-card padding="0 30rpx" width="630rpx" margin="30rpx 0 0 0">
				<view class="py-30 flex flex-between item-center">
					<view class="publish-label fo-28 bold">
						<text space="nbsp">小 费:</text>
					</view>
					<view class="publish-content fo-28 flex flex-between item-center">
						<view v-if="tipCurrent == 0" class="fo-28 fo-9">
							添加小费，接单更快哦!
						</view>
						<view v-else class="fo-28 fo-3">
							{{feeTips[tipCurrent]}}元
						</view>
						<view class="iconfont icon-arrow-right fo-28 fo-9"></view>
					</view>
				</view>
			</dd-card>
		</picker>

		<view class="fo-24 fo-9 mt-32">
			温馨提示：根据相关法律法规要求，跑男将在取货时对您所寄物品进行检查，请不要讲物品外包装封口。感谢您的配合！
		</view>

		<view style="height: 140rpx;"></view>

		<view class="bottom-fix flex flex-between item-center">
			<view class="fo-36 bold ml-32">
				需付款{{totalPrice}}元
			</view>
			<view class="publish-button" @click="publish()">
				立即下单
			</view>
		</view>
	</view>
</template>

<script>
	import AddressShow from '../../components/classic/AddressPicker/AddressShow.vue';
	import {
		$get,
		post,
		requestSubscribeMessage
	} from '../../util/request.js';
	import {
		BUY_NEARBY,
		HELP_BUY
	} from '../../util/constant.js'
	export default {
		components: {
			AddressShow
		},
		data() {
			return {
				originPrice: 0,
				totalPrice: 0,
				userCouponId: '',
				couponName: '',
				couponDiscount: 0,
				ableCoupons: 0,

				distance: 0,
				startPrice: 0,
				distancePrice: 0,
				weightPrice: 0,
				timePrice: 0,

				distanceLabel: '',
				weightLabel: '',
				serviceLabel: '',

				fee: 0,

				integralBalance: 0,
				withIntegral: 10000,
				canChangeAmount: 0, // 可抵扣
				useIntegral: 0, //使用积分
				useIntegralPay: false, // 使用积分抵扣

				tipCurrent: 0
			};
		},
		computed: {
			goodsDesc() {
				return this.$store.state.home.desc
			},
			start() {
				return this.$store.state.home.startAddress
			},
			end() {
				return this.$store.state.home.endAddress
			},
			feeTips() {
				const arr = ['不添加小费']
				return arr.concat(this.$store.state.home.feeTips)
			}
		},
		async onLoad() {
			await this.calculation()
			this.getCouponAbleCount();
			this.getIntegral();
		},
		methods: {
			bindPickerChange(e) {
				this.tipCurrent = e.detail.value
				if (this.tipCurrent > 0) {
					this.fee = parseInt(this.feeTips[this.tipCurrent])
				}
				this.sumTotalPrice()
			},
			sumTotalPrice() {
				let totalPrice = this.originPrice;
				if (this.useIntegralPay) {
					totalPrice -= this.canChangeAmount;
				} else if (this.couponDiscount) {
					totalPrice -= this.couponDiscount;
				}
				if (this.fee) {
					totalPrice += this.fee;
				}
				this.totalPrice = Math.floor(Math.round(totalPrice * 100)) / 100;
			},
			// 使用积分抵扣
			doUseIntegral(bool) {
				if (this.canChangeAmount > 0) {
					this.useIntegralPay = bool === undefined ? !this.useIntegralPay : bool;
					this.sumTotalPrice();
					this.userCouponId = '';
					this.couponName = '';
					this.couponDiscount = 0;
				}
			},
			// 获取积分 及 积分配置
			async getIntegral() {
				const result = await $get('home/integral')
				if (result.code === 200) {
					this.integralBalance = result.data.integralBalance;
					this.withIntegral = result.data.config ? result.data.config.withIntegral : 10000;
					this.getChangeAmount()
				}
			},
			// 获取积分抵扣价格
			getChangeAmount() {
				const amount = Math.floor(Math.round((this.integralBalance / this.withIntegral) * 100)) / 100;
				if (this.originPrice - amount < 0) {
					this.useIntegral = this.integralBalance - (amount - this.originPrice) * this.withIntegral;
					this.canChangeAmount = this.originPrice;
				} else {
					this.useIntegral = this.integralBalance
					this.canChangeAmount = amount;
				}
			},
			// 计算价格
			async calculation() {
				const home = this.$store.state.home;
				uni.showLoading({
					title: '正在计算价格'
				})
				const result = await post('order/calculation', {
					startAddress: home.buyStyle === BUY_NEARBY && home.tabCurrent === HELP_BUY ? undefined :
						home.startAddress,
					endAddress: home.endAddress,
					weight: home.weights[home.weightCurrent].value,
					goodsDesc: home.desc,
					serviceType: home.tabCurrent
				})
				uni.hideLoading();
				if (result.code === 200) {
					this.originPrice = result.data.totalPrice;
					this.totalPrice = result.data.totalPrice;
					this.distance = result.data.distance;
					this.distancePrice = result.data.distancePrice;
					this.weightPrice = result.data.weightPrice;
					this.timePrice = result.data.timePrice;
					this.distanceLabel = result.data.distanceLabel;
					this.weightLabel = result.data.weightLabel;
					this.serviceLabel = result.data.serviceTypeLabel;
				}
			},
			// 获取优惠券
			async getCouponAbleCount() {
				const result = await $get('coupon/able/count', {
					price: this.originPrice
				})
				if (result.code === 200) {
					this.ableCoupons = parseInt(result.data);
				}
			},
			navToCoupon() {
				uni.navigateTo({
					url: '/pages/mine/coupon/coupon?price=' + this.originPrice
				})
			},
			async publish() {
				const home = this.$store.state.home;
				const orderTmpId = home.notice.orderTempId;
				const provider = uni.getStorageSync('provider');
				if (provider === 'weixin') {
					await requestSubscribeMessage([orderTmpId, orderTmpId, orderTmpId])
				}

				uni.showLoading({
					title: '正在创建订单..'
				})

				const params = {
					startAddress: home.buyStyle === BUY_NEARBY && home.tabCurrent ===
						HELP_BUY ? undefined : home.startAddress,
					endAddress: home.endAddress,
					weight: home.weights[home.weightCurrent].value,
					goodsDesc: home.desc,
					serviceType: home.tabCurrent,
					userCouponId: this.userCouponId === '' ? undefined : this.userCouponId,
				}
				if (this.tipCurrent > 0) {
					params.fee = parseInt(this.feeTips[this.tipCurrent]);
				}
				if (this.useIntegralPay) {
					params.intergral = this.useIntegral
				}
				const result = await post('order/publish', params);
				uni.hideLoading();
				if (result.code !== 200) {
					return;
				}

				if (provider !== 'weixin') {
					uni.redirectTo({
						url: '/pages/order/detail/detail?orderNo=' + result.data.orderNo
					})
					return;
				}
				// 调起支付
				uni.getProvider({
					service: 'payment',
					complete: (res) => {
						if (res.errMsg === 'getProvider:ok') {
							const provider = res.provider[0];
							uni.requestPayment({
								provider,
								orderInfo: {},
								timeStamp: result.data.timeStamp,
								nonceStr: result.data.nonce_str,
								package: 'prepay_id=' + result.data.prepay_id,
								signType: 'MD5',
								paySign: result.data.paySign,
								complete: (res) => {
									if(res.errMsg === 'requestPayment:fail cancel'){
										uni.showToast({
											title: '支付取消',
											icon: 'success',
											duration: 800
										})
									}else{
										uni.showToast({
											title: '支付成功',
											icon: 'success',
											duration: 800
										})
									}
									const timeout = setTimeout(() => {
										uni.redirectTo({
											url: '/pages/order/detail/detail?orderNo=' +
												result.data.orderNo
										})
										clearTimeout(timeout)
									}, 800)
								}
							})
						}
					}
				})


			}
		}
	}
</script>

<style lang="scss" scoped>
	.publish-label {
		width: 120rpx;
	}

	.publish-content {
		width: 480rpx;
	}

	.bottom-fix {
		width: 750rpx;
		height: 140rpx;
		background-color: #ffffff;
		box-shadow: 0 -1rpx 10rpx 10rpx rgba($color: #000000, $alpha: 0.05);
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.publish-button {
		width: 200rpx;
		height: 100rpx;
		border-radius: 8rpx;
		background-color: $color-theme;
		color: #ffffff;
		font-size: 28rpx;
		line-height: 100rpx;
		margin-right: 30rpx;
		text-align: center;

		&:active {
			opacity: 0.8;
		}
	}
</style>
