<template>
	<view class="p-30">
		<view class="fo-50">
			请选择一个理由
		</view>
		<view class="mt-24 fo-28 fo-9">
			订单已被接单超过3分钟，取消后将扣除3.5元的违约费用。
		</view>
		<radio-group>
			<navigator v-for="(item,index) in isRider ? riderCancelTips: userCancelTips" :key="index"
				class="p-30 flex flex-between item-center border-b-none" @click="current = index">
				<view class="fo-28 fo-3">
					{{item}}
				</view>
				<radio :checked="index === current" />
			</navigator>
			<view>
				<navigator key="other" class="p-30 flex flex-between item-center " @click="current = -2">
					<view class="fo-28 fo-3">
						其他
					</view>
					<radio :checked="current === -2" />
				</navigator>
				<input class="reason" :disabled="current !== -2" type="text" placeholder="请输入取消理由"
					v-model="otherReason" />
			</view>
		</radio-group>
		<view class="mt-32">
			<ClassBtn label="提交理由并取消" @click="submit"></ClassBtn>
		</view>
	</view>
</template>

<script>
	import {
		$get,
		put
	} from '@/util/request.js'
	import ClassBtn from '@/components/classic/Button/ClassicButton.vue'
	export default {
		components: {
			ClassBtn
		},
		data() {
			return {
				userCancelTips: [],
				riderCancelTips: [],
				current: -1,
				otherReason: '',
				isRider: false,
				orderNo: ''
			};
		},
		onLoad(options) {
			this.orderNo = options.orderNo;
			if (options.isRider) {
				this.isRider = true;
			}
			this.getSeason()
		},
		methods: {
			async getSeason() {
				uni.showLoading({})
				const res = await $get('order/reason/info');
				uni.hideLoading();
				if (res.code === 200) {
					this.userCancelTips = res.data.userCancelTips;
					this.riderCancelTips = res.data.riderCancelTips;
				}
			},
			async submit() {
				if (this.current === -1) {
					uni.showToast({
						icon: 'none',
						title: '请选择一个理由'
					})
					return
				} else if (this.current === -2 && this.otherReason === '') {
					uni.showToast({
						icon: 'none',
						title: '请输入其他理由'
					})
					return
				}
				let cancelReason = '';
				if (this.current === -2) {
					cancelReason = '其他:' + this.otherReason
				}
				const url = this.isRider ? 'order/cancel/rider' : 'order/cancel';
				if (this.isRider && this.current !== -2) {
					cancelReason = this.riderCancelTips[this.current];
				} else {
					cancelReason = this.userCancelTips[this.current];
				}
				uni.showLoading();
				const res = await put(url, {
					cancelReason,
					orderNo: this.orderNo
				})
				uni.hideLoading();
				if(res.code === 200){
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.reason {
		width: 630rpx;
		height: 80rpx;
		background-color: #f3f3f3;
		border-radius: 8rpx;
		padding: 0 30rpx;
	}
</style>
