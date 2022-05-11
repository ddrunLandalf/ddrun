<template>
	<view >
		<view v-if="list.length > 0" class="p-30">
			<view v-if="!isChoose">
				<CouponItem v-for="(item,index) in list" :options="item" :key="index" />
				<view v-if="list.length> 0" class="p-30 fo-9 text-center fo-24">
					---- 已展示全部优惠券 ----
				</view>
			</view>
			<view v-else>
				<view  v-if="list.length > 0">
					<view class="fo-28 fo-3 mt-32 mb-32">
						可用优惠券
					</view>
					<CouponItem v-for="(item,index) in list" :options="item" :key="index" @click="chooseCoupon(item)" />
				</view>
				<view v-else class="fo-28 text-center p-30">
					无可用优惠券
				</view>
				<view v-if="disables.length > 0">
					<view class="fo-28 fo-9 mt-60 mb-32">
						未满足条件的优惠券
					</view>
					<CouponItem v-for="(item,index) in disables" type="disable" :options="item" :key="index" />
				</view>
			</view>
			
			<view v-if="overdues.length > 0">
				<view class="fo-28 fo-9 mt-60 mb-32">
					已过期的优惠券
				</view>
				<CouponItem  v-for="(item,index) in overdues" :options="item" :key="index" type="overdue" />
			</view>
		</view>
		<view v-else class="coupon-empty flex flex-center item-center">
			<view class="text-center">
				<view class="iconfont icon-coupon2">
				</view>
				<view class="fo-28 fo-9">
					{{isChoose ? '无可用优惠券':'暂无优惠券'}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { $get } from '../../../util/request.js'
	import CouponItem from '../../../components/base/Coupon/CouponItem.vue'
	export default {
		components:{
			CouponItem
		},
		data() {
			return {
				list: [],
				overdues: [],
				disables: [],
				isChoose: false, // 是否是选择优惠券
			};
		},
		onLoad(options) {
			if(options.price !== undefined){
				this.isChoose = true
			}
			this.getCoupon(options.price)
		},
		methods: {
			async getCoupon(price) {
				uni.showLoading()
				const params = {};
				if(price ){
					params.price = price
				}
				const result = await $get('coupon/list',params);
				uni.hideLoading()
				if(result.code === 200){
					this.list = result.data.able;
					this.overdues = result.data.overdues;
					this.disables = result.data.disable;
				}
			},
			chooseCoupon(item){
				const pages = getCurrentPages();
				const prevpage = pages[pages.length - 2];
				prevpage.$vm.doUseIntegral(false);
				prevpage.$vm.userCouponId = item.id;
				prevpage.$vm.couponName = item.couponName;
				prevpage.$vm.couponDiscount = item.discountAmount;
				prevpage.$vm.sumTotalPrice();
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
.coupon-empty{
	width: 100vw;
	height: 100vh;
	.icon-coupon2{
		font-size: 150rpx;
		margin-bottom: 30rpx;
		color: #999999;
	}
}
</style>
