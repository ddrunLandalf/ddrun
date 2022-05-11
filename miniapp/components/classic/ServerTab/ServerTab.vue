<template>
	<view>
		<view class="server-tab flex flex-center item-center">
			<view v-for="(item,index) in tabs" :key="index"
				:class="['tab-item',item.value === tabCurrent ? 'tab-item--avtive':'']"
				@click="tabCurrent = item.value">
				{{item.label}}
			</view>
		</view>
		<view style="height: 120rpx;"></view>
	</view>
</template>

<script>
	import {
		HELP_GET,
		HELP_DELIVER,
		HELP_BUY
	} from '../../../util/constant.js'
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				tabs: [{
						label: '帮我送',
						value: HELP_DELIVER
					},
					{
						label: '帮我取',
						value: HELP_GET
					},
					{
						label: '帮我买',
						value: HELP_BUY
					}
				]
			}
		},
		computed: {
			tabCurrent: {
				get() {
					return this.$store.state.home.tabCurrent
				},
				set(val) {
					if ((this.$store.state.home.tabCurrent === HELP_DELIVER && val === HELP_GET) || (this.$store.state
							.home.tabCurrent === HELP_GET && val === HELP_DELIVER) || (this.$store.state.home
							.tabCurrent === HELP_BUY && val === HELP_DELIVER) || (this.$store.state.home.tabCurrent ===
							HELP_DELIVER && val === HELP_BUY)) {
						const address = JSON.stringify(this.$store.state.home.startAddress);
						this.$store.commit('home/setStartAddress', this.$store.state.home.endAddress);
						this.$store.commit('home/setEndAddress', JSON.parse(address));
					}
					this.setTabCurrent(val)
				}
			}
		},
		methods: {
			...mapMutations('home', ['setTabCurrent'])
		}
	}
</script>

<style lang="scss">
	.server-tab {
		width: 750rpx;
		height: 120rpx;
		background-color: #FFFFFF;
		border-top: 1px solid #e1e1e1;
		position: fixed;
		top: 0;
		box-shadow: 0 1rpx 10rpx 10rpx rgba($color: #000000, $alpha: 0.05);

		.tab-item {
			width: 180rpx;
			font-size: 32rpx;
			border: 1px solid #ffffff;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 80rpx;
			color: #666666;
		}

		.tab-item--avtive {
			border: 1px solid $color-theme;
			color: $color-theme;
			font-weight: bold;
		}
	}
</style>
