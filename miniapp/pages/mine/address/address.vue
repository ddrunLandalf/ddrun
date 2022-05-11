<template>
	<view>
		<AddressConfig :type="type" :home="home" :company="company" @home-click="homeClick" @company-click="companyClick" />
		<view class="normal-tag">
			最近常用
		</view>
		<AddressItem v-for="(item,index) in list" :key="index" :options="item" :type="type" />
		<view v-if="loading" class="mt-32">
			<loading-location />
		</view>
		<view v-if="list.length === 0" class="location-empty py-100 text-center">
			<view class="iconfont icon-location-empty fo-none fo-80">
			</view>
			<view class="mt-32 fo-24 fo-none">
				暂无可用地址
			</view>
		</view>
		<view v-if="count >= list.length && !loading" class="p-30 text-center fo-24 fo-9">
			---- 已展示全部地址 ----
		</view>
	</view>
</template>

<script>
	import AddressConfig from '../../../components/classic/AddressPicker/AddressConfig.vue'
	import AddressItem from '../../../components/classic/AddressPicker/AddressItem.vue'
	import { $get } from '../../../util/request.js'
	export default {
		components: {
				AddressConfig,
				AddressItem
		},
		data() {
			return {
				loading: false,
				list: [],
				count: 0,
				current: 1,
				pageSize: 10,
				home: {},
				company: {},
				type: ''
			};
		},
		onLoad(event) {
			if(event.type){
				this.type = event.type
			}
		},
		onShow() {
			this.getAddress();
			this.getAddressList();
		},
		onPullDownRefresh() {
			this.getAddress();
			this.getAddressList();
		},
		onReachBottom() {
			if(this.count > this.list.length){
				this.getAddressList(true)
			}
		},
		methods: {
			async getAddressList(isBottom = false){
				this.loading = true;
				if(isBottom){
					this.current ++
				}else{
					this.current = 1
				}
				const result = await $get('user/address/list', {
					current: this.current,
					pageSize: this.pageSize
				});
				uni.stopPullDownRefresh();
				this.loading = false;
				if(result.code === 200){
					if(isBottom){
						this.list = this.list.concat(result.data.data);
					}else{
						this.list = result.data.data;
					}
					this.count = result.data.count;
				}
			},
			async getAddress(){
				const res = await $get('user/address/homeco');
				if(res.code === 200){
					this.home = res.data.home;
					this.company = res.data.company;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
