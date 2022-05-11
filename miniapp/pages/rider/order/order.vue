<template>
	<view>
		<OrderTab v-model="active" @change="tabChange" />
		<MineButton type="rider" />
		<view v-if="byList.length > 0 && query.status === 'wait'">
			<view class="normal-tag">
				分配给我的订单
			</view>
			<view class="p-30">
				<OrderItem v-for="(item,index) in byList" :key="index" :isRider="true" :options="item" @refresh="getToRiderList()" />
			</view>
		</view>
		<view >
			<view v-if="byList.length > 0 && query.status === 'wait'" class="normal-tag">
				空闲订单
			</view>
			<view class="p-30">
				<OrderItem v-for="(item,index) in list" :key="index" :isRider="true" :options="item" @refresh="getList()" />
			</view>
		</view>
		<view v-if="list.length === 0" class="text-center">
			<view class="iconfont icon-order fo-9 fo-80">
			</view>
			<view class="fo-24 fo-9 mt-16">
				暂无订单
			</view>
		</view>
		<view v-if="list.length > 0 && list.length === count" class="p-30 text-center fo-24 fo-9">
			---- 没有更多了 ----
		</view>
	</view>
</template>

<script>
	import MineButton from '../../../components/classic/Button/MineButton.vue'
	import OrderTab from '../../../components/classic/Order/OrderRiderTab.vue'
	import OrderItem from '@/components/classic/Order/OrderItem.vue'
	import {$get} from '@/util/request.js'
	export default {
		components: {
			MineButton,
			OrderTab,
			OrderItem
		},
		data() {
			return {
				active: 0,
				byList: [],
				query: {
					current: 1,
					pageSize: 12,
					status: 'wait'
				},
				count: 0,
				list: [],
				isLoad: false
			};
		},
		onLoad() {
			this.getList()
		},
		onShow() {
			if(this.isLoad){
				this.getList()
			}
		},
		onReachBottom() {
			if(this.count > this.list.length){
				this.getList(true)
			}
		},
		onPullDownRefresh() {
			this.getList()
		},
		methods: {
			async getToRiderList() {
				const res = await $get('order/list/byrider');
				if(res.code === 200){
					this.byList = res.data
				}
			},
			async getList(isBottom) {
				this.isLoad = true
				if(isBottom){
					this.query.current ++
				}else{
					this.query.current = 1
				}
				uni.showLoading({
				})
				if(this.query.status === 'wait'){
					await this.getToRiderList()
				}
				const res = await $get('order/list/rider', this.query);
				if(res.code === 200){
					if(isBottom){
						this.list = this.list.concat(res.data.data)
					}else{
						this.list = res.data.data;
					}
					this.count = res.data.count;
				}
				uni.hideLoading();
				uni.stopPullDownRefresh();
			},
			tabChange(e){
				this.active = e;
				if(e === 0){
					this.query.status = 'wait'
				}else if(e === 1){
					this.query.status = 'sending'
				}else{
					this.query.status = 'all'
				}
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scope>

</style>
