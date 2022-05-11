<template>
	<view class="publish">
		<dd-card padding="30rpx" width="630rpx">
			<view class="bold fo-50">
				{{type}}
			</view>
			<view class="show-item flex flex-between mt-8 item-center">
				<dot />
				<view v-if="start.province" class="address-content border-b py-30" >
					<view class="fo-28 fo-3">
						{{start.province}}{{start.city}}{{start.district}}{{start.addressDetail}}
					</view>
					<view class="fo-24 fo-6">
						{{start.mobileNumber}} {{start.contactName}}
					</view>
					<view v-if="isRider">
						<view class="op-btn op-btn-info" @click="makePhoneCall(start.mobileNumber)">
							<view class="iconfont icon-call fo-32 fo-w">
							</view>
						</view>
						<view class="op-btn op-btn-green " @click="openLocation(start.latitude,start.longitude,start.addressDetail)">
							<view class="iconfont icon-navigation fo-32 fo-w">
							</view>
						</view>
					</view>
				</view>
				<view v-else class="address-content border-b py-30">
					<view class="fo-36">
						就近购买
					</view>
				</view>
			</view>
			<view class=" show-item flex flex-between item-center">
				<dot color="orange" />
				<view class="address-content py-30">
					<view class="fo-28 fo-3">
						{{end.province}}{{end.city}}{{end.district}}{{end.addressDetail}}
					</view>
					<view class="fo-24 fo-6">
						{{end.mobileNumber}} {{end.contactName}}
					</view>
				</view>
				<view v-if="isRider">
					<view class="op-btn op-btn-info" @click="makePhoneCall(end.mobileNumber)">
						<view class="iconfont icon-call fo-32 fo-w">
						</view>
					</view>
					<view class="op-btn op-btn-green " @click="openLocation(end.latitude,end.longitude,end.addressDetail)">
						<view class="iconfont icon-navigation fo-32 fo-w">
						</view>
					</view>
				</view>
			</view>
		</dd-card>
		
	</view>
</template>

<script>
	export default {
		props: {
			start: {
				type: Object,
				default: {}
			},
			end: {
				type: Object,
				default: {}
			},
			type: {
				type: String,
				default: ''
			},
			isRider: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			makePhoneCall(phoneMobile){
				uni.makePhoneCall({
					phoneNumber: phoneMobile
				})
			},
			openLocation(lat,lng ,name) {
				uni.openLocation({
					latitude: lat,
					longitude: lng,
					name
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.publish{
		.address-content{
			width: 578rpx;
			margin-left: 30rpx;
			
		}
		.show-item{
			position: relative;
		}
		.op-btn{
			width: 80rpx;
			height: 80rpx;
			border-radius: 80rpx;
			text-align: center;
			line-height: 80rpx;
			position: absolute;
			bottom: -40rpx;
		}
		.op-btn-info{
			background-color: $color-info;
			right: 140rpx;
			
		}
		.op-btn-green {
			background-color: $color-green;
			right: 30rpx;
		}
	}
</style>
