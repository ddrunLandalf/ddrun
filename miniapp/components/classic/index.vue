<template>
	<view>
		<ServerTab></ServerTab>
		<view class="classic-content">
			<AddressPicker :city="city"></AddressPicker>
			<WeightPicker></WeightPicker>
			<Desc></Desc>
			<view class="mt-32">
				<ClassicButton label="下一步" @click="doNext"></ClassicButton>
			</view>
			<MineBtn type="user" />
		</view>
	</view>
</template>

<script>
	import ServerTab from './ServerTab/ServerTab.vue'
	import AddressPicker from './AddressPicker/AddressPicker.vue'
	import WeightPicker from './WeightPicker/WeightPicker.vue'
	import Desc from './Desc/Desc.vue'
	import ClassicButton from './Button/ClassicButton.vue'
	import MineBtn from './Button/MineButton.vue'
	import {
		HELP_DELIVER,
		HELP_BUY,
		HELP_GET,
		BUY_NEARBY
	} from '../../util/constant.js'
	export default {
		props: {
			city: {
				type: String,
				default: '----'
			}
		},
		components: {
			ServerTab,
			AddressPicker,
			WeightPicker,
			Desc,
			ClassicButton,
			MineBtn
		},
		data() {
			return {

			}
		},
		methods: {
			doNext() {
				const home = this.$store.state.home;
				if (!(home.tabCurrent === HELP_BUY && home.buyStyle === BUY_NEARBY)) {
					const startAddress = home.startAddress;
					if (!startAddress.province || !startAddress.city || !startAddress.district || !startAddress.latitude ||
						!startAddress.longitude || !startAddress.contactName || !startAddress.mobileNumber ||
						!startAddress.addressDetail) {
						uni.showToast({
							title: '请补充完起点地址',
							icon: 'none'
						});
						return;
					}
				}
				const endAddress = home.endAddress;
				if (!endAddress.province || !endAddress.city || !endAddress.district || !endAddress.latitude ||
					!endAddress.longitude || !endAddress.contactName || !endAddress.mobileNumber ||
					!endAddress.addressDetail) {
					uni.showToast({
						title: '请补充完终点地址',
						icon: 'none'
					});
					return;
				}
				if(!home.desc){
					uni.showToast({
						title: '请描述您的物品',
						icon: 'none'
					});
					return ;
				}
				uni.navigateTo({
					url: '/pages/publish/publish'
				})
			}
		}
	}
</script>

<style lang="scss">
	.classic-content {
		padding: 32rpx;
	}
</style>
