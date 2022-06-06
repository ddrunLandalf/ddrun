<script>
	export default {
		onLaunch() {
			uni.getProvider({
				service: 'oauth',
				complete(res) {
					uni.setStorageSync('provider', res.provider[0])
				}
			})
			this.$store.dispatch('home/getNoticeConfig');
			
		},
		onShow() {},
		onHide() {}
	}
</script>

<style lang="scss">
	@import './util/font.css';

	.flex {
		display: flex;

		&-center {
			justify-content: center;
		}

		&-start {
			justify-content: flex-start;
		}

		&-end {
			justify-content: flex-end;
		}

		&-around {
			justify-content: space-around;
		}

		&-between {
			justify-content: space-between;
		}

		&-wrap {
			flex-wrap: wrap;
		}
	}

	.item {
		&-start {
			align-items: flex-start;
		}

		&-center {
			align-items: center;
		}

		&-end {
			align-items: flex-end;
		}
	}

	.text-center {
		text-align: center;
	}

	.text-right {
		text-align: right;
	}

	.bold {
		font-weight: bold;
	}

	.bold-500 {
		font-weight: 500;
	}

	.ell {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ell-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.border-t {
		border-top: 1px solid #e1e1e1;
	}

	.border-b {
		border-bottom: 1px solid #e1e1e1;
	}
	.border-b-none {
		border-bottom: 1px solid $color-none;
	}

	.bg-t {
		background-color: $color-theme;
	}

	.bg-none {
		background-color: $color-none;
	}

	.fo-3 {
		color: #333333;
	}

	.fo-6 {
		color: #666666;
	}

	.fo-9 {
		color: #999999;
	}

	.fo-none {
		color: $color-none;
	}

	.fo-w {
		color: #FFFFFF;
	}
	.fo-green {
		color: $color-green;
	}
	.fo-info {
		color: $color-info;
	}
	.fo-price{
		color: $color-price;
	}

	.fo-50 {
		font-size: 50rpx;
	}

	.fo-40 {
		font-size: 40rpx;
	}

	.fo-36 {
		font-size: 36rpx;
	}

	.fo-32 {
		font-size: 32rpx;
	}

	.fo-28 {
		font-size: 28rpx;
	}

	.fo-26 {
		font-size: 26rpx;
	}

	.fo-24 {
		font-size: 24rpx;
	}

	.fo-80 {
		font-size: 80rpx;
	}
	.h-100{
		height: 100rpx;
	}

	.mt-8 {
		margin-top: 8rpx;
	}
	.mt-12{
		margin-top: 12rpx;
	}
	.mt-16 {
		margin-top: 16rpx;
	}

	.mt-24 {
		margin-top: 24rpx;
	}
	
	.mt-30 {
		margin-top: 30rpx;
	}

	.mt-32 {
		margin-top: 32rpx;
	}

	.mt-50 {
		margin-top: 50rpx;
	}

	.mt-60 {
		margin-top: 60rpx;
	}

	.ml-12 {
		margin-left: 12rpx;
	}

	.ml-16 {
		margin-left: 16rpx;
	}

	.ml-24 {
		margin-left: 24rpx;
	}

	.ml-30 {
		margin-left: 30rpx;
	}

	.ml-32 {
		margin-left: 32rpx;
	}

	.ml-36 {
		margin-left: 36rpx;
	}

	.ml-40 {
		margin-left: 40rpx;
	}

	.p-30 {
		padding: 30rpx;
	}
	.pb-30{
		padding-bottom: 30rpx;
	}
	.py-30 {
		padding-top: 30rpx;
		padding-bottom: 30rpx;
	}

	.py-100 {
		padding-top: 100rpx;
		padding-bottom: 100rpx;
	}

	.px-30 {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.mr-8 {
		margin-right: 8rpx;
	}

	.mr-12 {
		margin-right: 12rpx;
	}

	.mr-16 {
		margin-right: 16rpx;
	}

	.mr-20 {
		margin-right: 20rpx;
	}

	.mr-20 {
		margin-right: 20rpx;
	}

	.mr-24 {
		margin-right: 24rpx;
	}

	.mb-32 {
		margin-bottom: 32rpx;
	}

	.mb-28 {
		margin-bottom: 28rpx;
	}

	.bold {
		font-weight: bold;
	}

	.fo-price {
		color: $color-price;
	}

	.normal-tag {
		font-size: 28rpx;
		line-height: 50rpx;
		color: #999999;
		padding: 0 30rpx;
		background-color: #f3f3f3;
		margin-top: 30rpx;
		display: inline-block;
		border-radius: 0 50rpx 50rpx 0;
	}
	
	.empty{
		width: 100vw;
		height: 100vh;
	}
	
	.order-btn{
		padding: 0 30rpx;
		line-height: 70rpx;
		font-size: 28rpx;
		color: #ffffff;
		border-radius: 70rpx;
		&:active {
			opacity: 0.8;
		}
	}
	
	.order-btn--info{
		background-color: $color-info;
	}
	
	.order-btn--none{
		background-color: #aaaaaa;
	}
	
	.filter-btn{
	  background: none;
	  padding: 0;
	  border: none;
	  outline: none;
	  line-height: unset;
	  box-sizing: unset;
	  -webkit-tap-highlight-color: unset;
	  position: unset;
	  display: block;
	  border-radius: 0;
	  text-align: left
	}
	.filter-btn::after{
	  background: none;
	  padding: 0;
	  border: none;
	  outline: none;
	  line-height: unset;
	  box-sizing: unset;
	  -webkit-tap-highlight-color: unset;
	  position: unset;
	  display: block;
	  border-radius: 0;
	  text-align: left
	
	}
</style>
