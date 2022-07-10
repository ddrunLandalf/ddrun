<template>
	<view>
		<view class="p-30">
			<view class="fo-50">
				请补充地址信息
			</view>
			<view class="flex flex-between item-center mt-32" @click="navToSearch">
				<view class="iconfont icon-location fo-32"></view>
				<view class="ml-32 fo-28 address-content flex flex-start item-center py-30">
					<view class="address-content-text">
						<view v-if="!formData.province" class="fo-9">
							点击搜索地址
						</view>
						<view class="fo-3 ell">
							{{formData.province}}{{formData.city}}{{formData.district}}
						</view>
					</view>
					<view class="iconfont icon-arrow-right ml-32 fo-28"></view>
				</view>
			</view>

			<view class="py-30 border-b flex flex-start item-center">
				<input class="fo-28 address-input" style="margin-left: 64rpx;width: 626rpx" placeholder-class="fo-9"
					type="text" v-model="formData.addressDetail" placeholder="请补充具体门牌号码" />
			</view>

			<view class="py-30 border-b flex flex-start item-center">
				<view class="iconfont icon-mobile fo-32"></view>
				<input class="fo-28 address-input ml-32" style="width: 626rpx" placeholder-class="fo-9" type="number"
					v-model="formData.mobileNumber" placeholder="请补充手机号码" />
			</view>

			<view class="py-30 border-b flex flex-start item-center">
				<view class="iconfont icon-user fo-32"></view>
				<input class="fo-28 address-input ml-32" style="width: 626rpx" placeholder-class="fo-9" type="text"
					v-model="formData.contactName" placeholder="请填写联系人姓名" />
			</view>

			<view class="py-30">
				<view class="fo-28 fo-3">
					智能填写
				</view>
				<view class="auto-content mt-24">
					<textarea v-model="autoText" placeholder-class="fo-28 fo-9" class="fo-28 auto-text"
						placeholder="粘贴地址信息，自动拆分姓名、电话和地址" />
					<view :class="['btn-sm', autoText ? 'btn-sm--able':'btn-sm--disable']"
						@click="autoText ? doParse():null">
						识别
					</view>
				</view>
			</view>
			<view class="mt-50">
				<ClassicBtn label="确认" width="690rpx" @click="submit()" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		post,$get
	} from '../../../../util/request.js'
	import ClassicBtn from '../../../../components/classic/Button/ClassicButton.vue'
	export default {
		components: {
			ClassicBtn
		},
		data() {
			return {
				formData: {
					mobileNumber: '',
					contactName: '',
					province: '',
					city: '',
					district: '',
					latitude: '',
					longitude: '',
					streetNumber: '',
					addressDetail: ''
				},
				type: 'start',
				autoText: ''
			};
		},

		onLoad(event) {
			let text = '';
			switch (event.type) {
				case 'start':
					text = '起点地址';
					break;
				case 'end':
					text = '终点地址';
					break;
				case 'home':
					text = '家的地址';
					break;
				case 'company':
					text = '公司地址';
					break;
				case 'update':
					text = '编辑地址';
					break;
				case 'add':
					text = '新增地址';
					break;
			}
			uni.setNavigationBarTitle({
				title: text
			})
			this.type = event.type;
			if (this.type === 'start' || this.type === 'end') {
				const address = this.type === 'start' ? this.$store.state.home.startAddress : this.$store.state.home
					.endAddress;
				this.formData = Object.assign(this.formData, address)
			}
			if (event.address) {
				this.formData = JSON.parse(event.address)
			}
		},
		methods: {
			navToSearch() {
				
				uni.chooseLocation({
					complete: async (res) => {
						if(res.errMsg==="chooseLocation:ok"){
							uni.showLoading({
								title: '获取中'
							})
							const map = await $get('map/location',{
								latitude: res.latitude,
								longitude: res.longitude
							});
							uni.hideLoading();
							if(map.code === 200){
								this.formData.province = map.data.province;
								this.formData.city = map.data.city;
								this.formData.district = map.data.district;
								this.formData.streetNumber = map.data.street_number;
								this.formData.latitude = map.data.latitude;
								this.formData.longitude = map.data.longitude;
								this.formData.addressDetail = map.data.street_number
							}
						} else{
							uni.navigateTo({
								url: '/pages/mine/address/search/search'
							})
						}
					}
				})
			},
			async doParse() {
				uni.showLoading({})
				const result = await post('map/address/parse', {
					keyword: this.autoText
				});
				uni.hideLoading()
				if (result.code === 200) {
					this.formData.mobileNumber = result.data.mobile;
					this.formData.contactName = result.data.name;
					if (result.data.address_components) {
						this.formData.province = result.data.province;
						this.formData.city = result.data.city;
						this.formData.district = result.data.area;
						this.formData.streetNumber = result.data.address_components.street_number;
						this.formData.addressDetail = result.data.details;
						this.formData.latitude = result.data.location.lat;
						this.formData.longitude = result.data.location.lng;
					}
				}
			},
			async submit() {
				if (!this.formData.latitude || !this.formData.longitude || !this.formData.province) {
					uni.showToast({
						icon: 'none',
						title: '请完善地址信息'
					})
					return
				}
				if (!this.formData.addressDetail) {
					uni.showToast({
						icon: 'none',
						title: '请补充具体门牌号码'
					})
					return
				}
				if (!this.formData.mobileNumber) {
					uni.showToast({
						icon: 'none',
						title: '请补充手机号码'
					})
					return
				}
				if (this.formData.mobileNumber.length !== 11) {
					uni.showToast({
						icon: 'none',
						title: '请输入11位手机号码'
					})
					return
				}
				if (!this.formData.contactName) {
					uni.showToast({
						icon: 'none',
						title: '请填写联系人姓名'
					})
					return
				}
				if (this.type === 'start' || this.type === 'end') {
					const method = this.type === 'start' ? 'home/setStartAddress' : 'home/setEndAddress'
					this.$store.commit(method, this.formData);
				} 
				
				if(this.type === 'home' || this.type === 'company'){
					this.formData.type = this.type;
				}
				delete this.formData.createTime;
				delete this.formData.updateTime;
				delete this.formData.isDelete;
				delete this.formData.userNo;
				uni.showLoading({
					title: '保存中'
				})
				const res = await post('user/address/add',this.formData);
				uni.hideLoading();
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-content {
		width: 626rpx;
		border-bottom: 1px solid #e1e1e1;

		.address-content-text {
			width: 562rpx;
		}

		.address-input {
			width: 626rpx;
		}

	}

	.auto-content {
		padding: 24rpx;
		border-radius: 8rpx;
		border: 1rpx solid #e1e1e1;
		position: relative;

		.auto-text {
			height: 180rpx;
		}

		.btn-sm {
			width: 80rpx;
			height: 50rpx;
			font-size: 24rpx;
			text-align: center;
			line-height: 50rpx;
			color: #ffffff;
			border-radius: 8rpx;
			position: absolute;
			bottom: 24rpx;
			right: 24rpx;
			z-index: 5;
		}

		.btn-sm--disable {
			background-color: #e3e7ea;
		}

		.btn-sm--able {
			background-color: $color-theme;
		}
	}
</style>
