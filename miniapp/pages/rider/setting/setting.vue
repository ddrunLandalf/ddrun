<template>
	<view>
		<view class="p-30 flex flex-between item-center border-b border-t">
			<view class="fo-28 fo-3">
				开启接单
			</view>
			<switch :checked="startReceive" @change="checkedChange" />
		</view>
		
		<navigator class="p-30 flex flex-between item-center border-b" url="/pages/rider/city/city">
			<view class="fo-28 fo-3">
				接单城市
			</view>
			<view class="flex flex-end item-center">
				<view class="fo-28 fo-9">
					{{cityName}}
				</view>
				<view class="iconfont icon-arrow-right fo-28 fo-9 ml-24"></view>
			</view>
		</navigator>
	</view>
</template>

<script>
	import {$get,put} from '@/util/request.js'
	export default {
		data() {
			return {
				startReceive: false,
				cityNo: '',
				cityName: ''
			};
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			async getInfo(){
				uni.showLoading()
				const res = await $get('rider/update/info');
				if(res.code === 200){
					this.cityName = res.data.cityName;
					this.cityNo = res.data.cityNo;
					this.startReceive = res.data.startReceive;
				}
				uni.hideLoading()
			},
			async checkedChange(e){
				const checked = e.detail.value;
				uni.showLoading()
				const res = await put('rider/update', {
					startReceive: checked
				});
				uni.hideLoading()
				if(res.code === 200){
					this.startReceive = checked
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
