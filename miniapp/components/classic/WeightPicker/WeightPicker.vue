<template>
	<picker class="mt-32" @change="bindPickerChange" :value="weightCurrent" range-key="label" :range="weights">
		<dd-card padding="30rpx" width="626rpx" >
			<view class="flex flex-between item-center weight-picker">
				<view class="flex flex-start item-center">
					<view class="iconfont icon-weight fo-28"></view>
					<view class="fo-28 ml-32">
						物品重量预估
					</view>
				</view>
				<view class="flex flex-end item-center">
					<view class="fo-28 fo-9">
						{{weights.length>0? weights[weightCurrent].label : '暂无选项'}}
					</view>
					<view class="fo-28 fo-9 iconfont icon-arrow-right ml-16"></view>
				</view>
			</view>
		</dd-card>
	</picker>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {
			}
		},
		computed: {
			weights(){
				return this.$store.state.home.weights
			},
			weightCurrent: {
				get() {
					return this.$store.state.home.weightCurrent
				},
				set(val){
					this.setWeightCurrent(val)
				}
			}
		},
		methods: {
			...mapMutations('home',['setWeightCurrent']),
			bindPickerChange(e){
				this.weightCurrent = e.detail.value
			}
		}
	}
</script>

<style lang="scss">
.weight-picker{
	width: 626rpx;
}
</style>
