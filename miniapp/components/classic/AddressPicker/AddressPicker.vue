<template>
	<view>
		<dd-card padding="30rpx" width="626rpx">
			<view class="flex flex-start item-center mb-28" @click="navToCity()">
				<view class="iconfont icon-local fo-32">
				</view>
				<view class="fo-28 ml-16">
					所在城市：{{city}} <text v-if="!isOp" class="fo-9 fo-24">(该城市暂未开通运营)</text>
				</view>
			</view>

			<AddressBtn class="mt-16" dot="green" placeholder="到哪里拿货"
				:type="tabCurrent === HELP_BUY ? 'radio':'default'" :address="startAddress"  @click="startClick">
			</AddressBtn>

			<AddressBtn class="mt-24" dot="orange" placeholder="送到哪里" border-t :address="endAddress" point="end" @click="endClick">
			</AddressBtn>

		</dd-card>
	</view>
</template>

<script>
	import AddressBtn from './AddressBtn.vue'
	import {
		HELP_DELIVER,
		HELP_BUY,
		HELP_GET
	} from '../../../util/constant.js'
	export default {
		props: {
			city: {
				type: String,
				default: '----'
			}
		},
		components: {
			AddressBtn
		},
		data() {
			return {
				HELP_DELIVER,
				HELP_BUY,
				HELP_GET,
				provider: uni.getStorageSync('provider')
			};
		},
		computed: {
			startAddress() {
				return this.$store.state.home.startAddress
			},
			endAddress() {
				return this.$store.state.home.endAddress
			},
			tabCurrent() {
				return this.$store.state.home.tabCurrent
			},
			isOp(){
				return this.$store.state.home.isOp
			}
		},
		
		methods: {
			navToCity() {
				uni.navigateTo({
					url: '/pages/mine/address/city/city'
				})	
			},
			startClick() {
				this.navTo('start')
			},
			endClick() {
				this.navTo('end')
			},
			navTo(type) {
				if (!uni.getStorageSync('userInfo')) {
					wx.navigateTo({
						url: this.provider === 'qq' ? '/pages/login/phone/phone':'/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/mine/address/supply/supply?type=' + type
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
