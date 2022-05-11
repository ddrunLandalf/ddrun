<template>
	<view>
		<view v-if="ing.length > 0">
			<view class="normal-tag">
				进行中的订单
			</view>
			<view class="p-30">
				<OrderItem v-for="(item,index) in ing" :key="index" :options="item" />
			</view>
		</view>

		<view v-if="list.length > 0">
			<view class="normal-tag">
				已完成的订单
			</view>
			<view class="p-30">
				<OrderItem v-for="(item,index) in list" :key="index" :options="item" />
			</view>
		</view>

		<view v-if="loading" class="py-100">
			<loading-order />
		</view>

		<view v-if="list.length === 0 && ing.length === 0 && !loading"
			class="empty text-center flex flex-center item-center">
			<view>
				<view class="iconfont icon-order-empty fo-none ">
				</view>
				<view class="mt-32 fo-24 fo-none">
					您还没有订单
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import OrderItem from '../../components/classic/Order/OrderItem.vue'
	import {
		$get
	} from '../../util/request.js'
	export default {
		components: {
			OrderItem
		},
		data() {
			return {
				ing: [],
				loading: false,
				query: {
					current: 1,
					pageSize: 10
				},
				count: 0,
				list: []
			};
		},
		onLoad() {
			this.getIng();
			this.getList();
		},
		onPullDownRefresh() {
			this.getIng();
			this.getList();
		},
		onReachBottom() {
			if(this.count < this.list.length){
				this.getList(true);
			}
		},
		methods: {
			async getIng() {
				const result = await $get('order/ing');
				if (result.code === 200) {
					this.ing = result.data
				}
			},
			async getList(isBottom = false) {
				if (isBottom) {
					this.query.current++
				} else {
					this.query.current = 1
				}
				this.loading = true
				const result = await $get('order/list', this.query);
				this.loading = false
				uni.stopPullDownRefresh();
				if (result.code === 200) {
					if (isBottom) {
						this.list = this.list.concat(result.data.data);
					} else {
						this.list = result.data.data;
					}
					this.count = result.data.count;
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.icon-order-empty {
		font-size: 120rpx;
	}
</style>
