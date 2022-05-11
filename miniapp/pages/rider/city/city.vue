<template>
	<view>
		<view v-for="(item,index) in list" :key="index" class="p-30 border-b flex flex-between item-center" @click="updateCity(item.cityNo, item.cityName)">
			<view class="fo-28">
				{{item.cityName}}
			</view>
			<view class="iconfont icon-change fo-9 fo-24">
			</view>
		</view>
		
		<view v-if="this.list.length === count && count > 0" class="p-30 text-center fo-24 fo-6">
			---- 以展示全部城市 ----
		</view>
		<view v-else-if="this.list.length === 0" class="p-30 text-center fo-24 fo-6">
			---- 暂无运营城市 ----
		</view>
	</view>
</template>

<script>
	import {
		$get,put
	} from '@/util/request.js'
	export default {
		data() {
			return {
				query: {
					current: 1,
					pageSize: 20,
					cityName: ''
				},
				list: [],
				count: 0,
				type: 'update'
			};
		},
		onPullDownRefresh() {
			this.getList()
		},
		onLoad(e) {
			if(e.type){
				this.type = e.type
			}
			this.getList()
		},
		onReachBottom() {
			if (this.list.length < this.count) {
				this.getList(true)
			}
		},
		methods: {
			async updateCity(cityNo, cityName) {
				if(this.type === 'update'){
					uni.showLoading();
					const res = await put('rider/update',{
						cityNo
					})
					uni.hideLoading();
					if(res.code === 200){
						uni.navigateBack({
							delta: 1
						})
					}
				}else{
					const pages = getCurrentPages();
					const page = pages[pages.length - 2]
					page.$vm.cityNo = cityNo;
					page.$vm.cityName = cityName;
					uni.navigateBack({
						delta: 1
					})
				}
			},
			async getList(isBottom) {
				uni.showLoading();
				if (isBottom) {
					this.query.current++
				} else {
					this.query.current = 1
				}
				const res = await $get('city/list', this.query);
				uni.hideLoading()
				if (res.code === 200) {
					this.count = res.data.count
					if (isBottom) {
						this.list = this.list.concat(res.data.data);
					} else {
						this.list = res.data.data
					}
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
