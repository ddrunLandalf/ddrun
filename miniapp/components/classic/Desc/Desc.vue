<template>
	<dd-card padding="30rpx" width="626rpx" margin="32rpx 0 0 0">
		<view class="flex flex-start item-center">
			<view class="iconfont icon-text fo-28"></view>
			<view class="fo-28 ml-32">
				描述物品内容
			</view>
		</view>
		<textarea v-model="desc" class="fo-32 mt-32" value="" auto-height placeholder="请描述您的物品" />
		<view class="flex flex-start flex-wrap mt-24">
			<view v-for="(item,index) in tags" :key="index" class="good-item" @click="$store.commit('home/appendDesc', item)">
				+ {{item}}
			</view>
		</view>
	</dd-card>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		computed: {
			tags() {
				return this.$store.state.home.tags
			},
			desc: {
				get(){
					return this.$store.state.home.desc
				},
				set(val){
					this.$store.commit('home/setDesc', val)
				}
			}
		}
	}
</script>

<style lang="scss">
.good-item{
	padding: 0 30rpx;
	line-height: 60rpx;
	font-size: 28rpx;
	border-radius: 60rpx;
	background-color: #f3f3f3;
	border: 1px solid #ffffff;
	color: #999999;
	margin-top: 16rpx;
	margin-right: 16rpx;
}
</style>
