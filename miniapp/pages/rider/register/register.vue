<template>
	<view class="p-30">
		<view class="fo-50">
			请认真填写资料
		</view>
		<view class="flex flex-between item-center border-b py-30" @click="navToCity">
			<view class="fo-28">
				选择城市
			</view>
			<view class="flex flex-end item-center">
				<view class="fo-28 fo-9">
					{{cityName || '请选择一个运营城市'}}
				</view>
				<view class="iconfont icon-arrow-right fo-6 fo-28 ml-12">
				</view>
			</view>
		</view>
		<view class="flex flex-between item-center border-b py-30">
			<view class="fo-28">
				真实姓名
			</view>
			<input type="text" v-model="realname" class="text-right fo-28" placeholder="输入姓名" />
		</view>
		<view class="flex flex-between item-center border-b py-30">
			<view class="fo-28">
				身份证号码
			</view>
			<input type="text" v-model="idCardNo" class="text-right fo-28" placeholder="输入18位身份证号码" />
		</view>
		<view class="py-30 border-b">
			<view class="fo-28">
				身份证正面
			</view>
			<view class="flex flex-between item-center mt-24">
				<view class="card-panel">
					<image v-if="temp1 || avatarFaceImage" :src="temp1 || avatarFaceImage" mode="aspectFill"></image>
					<view v-else class="iconfont icon-idcard1 idcard-font fo-9">
					</view>
				</view>
				<view class="card-btn-panel text-center">
					<button class="bg-t fo-w fo-28" @click="chooseImg('temp1')">点击上传</button>
					<view class="mt-16 fo-24 fo-9">
						请上传字迹清晰的照片
					</view>
				</view>
			</view>
		</view>

		<view class="py-30 border-b">
			<view class="fo-28">
				身份证反面
			</view>
			<view class="flex flex-between item-center mt-24">
				<view class="card-panel">
					<image v-if="temp2 || nationalFaceImage" :src="temp2 || nationalFaceImage" mode="aspectFill">
					</image>
					<view v-else class="iconfont icon-idcard2 idcard-font fo-9">
					</view>
				</view>
				<view class="card-btn-panel text-center">
					<button class="bg-t fo-w fo-28" @click="chooseImg('temp2')">点击上传</button>
					<view class="mt-16 fo-24 fo-9">
						请上传字迹清晰的照片
					</view>
				</view>
			</view>
		</view>

		<view class="py-30">
			<checkbox-group @change="agreeChange">
				<label class="fo-26">
					<checkbox :checked="agree" />
					<view class="fo-24" style="display: inline;">我已阅读 <view class="fo-info" style="display: inline;"
							@click.stop="navToText">《申请跑男协议》</view>,勾选表示同意协议</view>
				</label>
			</checkbox-group>
			<view class="py-30">
				<ClassicButton label="提交资料" @click="submit" />
			</view>
		</view>

	</view>
</template>

<script>
	import ClassicButton from '../../../components/classic/Button/ClassicButton.vue'
	import {
		upload,
		post,
		$get
	} from '@/util/request.js'
	export default {
		components: {
			ClassicButton
		},
		data() {
			return {
				realname: '',
				idCardNo: '',
				avatarFaceImage: '',
				nationalFaceImage: '',
				cityNo: '',
				cityName: '',
				temp1: '',
				temp2: '',
				agree: false
			};
		},
		async onLoad() {
			uni.showLoading();
			const res = await $get('rider/register/info');
			if(res.code === 200 && res.data){
				this.realname = res.data.realname;
				this.idCardNo = res.data.idCardNo;
				this.avatarFaceImage = res.data.avatarFaceImage;
				this.nationalFaceImage = res.data.nationalFaceImage;
			}
			uni.hideLoading()
			
			
		},
		methods: {
			agreeChange(e) {
				this.agree = e.detail.value.length === 1
			},
			navToCity() {
				uni.navigateTo({
					url: '/pages/rider/city/city?type=register'
				})
			},
			navToText() {
				uni.navigateTo({
					url: '/pages/text/text?type=riderAgreement'
				})
			},
			chooseImg(type) {
				uni.chooseImage({
					count: 1,
					complete: (e) => {
						if (e.errMsg === 'chooseImage:ok') {
							this[type] = e.tempFilePaths[0];
						}
					}
				})
			},
			async submit() {
				uni.showLoading()
				if (this.temp1) {
					this.avatarFaceImage = await upload(this.temp1)
				}
				if (this.temp2) {
					this.nationalFaceImage = await upload(this.temp2)
				}
				uni.hideLoading()
				// 校验
				if (!this.agree) {
					uni.showToast({
						icon: 'none',
						title: '请同意勾选《申请跑男协议》'
					})
					return
				}
				if (!this.cityNo) {
					uni.showToast({
						icon: 'none',
						title: '请选择一个运营城市'
					})
					return
				}
				if (!this.realname) {
					uni.showToast({
						icon: 'none',
						title: '请输入真实姓名'
					})
					return
				}
				if (!this.idCardNo || this.idCardNo.length != 18) {
					uni.showToast({
						icon: 'none',
						title: '请输入18位身份证号码'
					})
					return
				}
				if (!this.avatarFaceImage) {
					uni.showToast({
						icon: 'none',
						title: '请上传身份证正面照片'
					})
					return
				}
				if (!this.nationalFaceImage) {
					uni.showToast({
						icon: 'none',
						title: '请上传身份证背面照片'
					})
					return
				}
				uni.requestSubscribeMessage({
					tmplIds: [this.$store.state.home.notice.verifyTempId],
					complete: async () => {
						uni.showLoading()
						const res = await post('rider/register', {
							realname: this.realname,
							idCardNo: this.idCardNo,
							avatarFaceImage: this.avatarFaceImage,
							nationalFaceImage: this.nationalFaceImage,
							cityNo: this.cityNo,
						})
						uni.hideLoading()
						if (res.code === 200) {
							uni.redirectTo({
								url: '/pages/rider/status/status'
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.card-panel {
		width: 345rpx;
		border-radius: 8rpx;

		image {
			width: 345rpx;
			height: 230rpx;
			border-radius: 8rpx;
		}
	}

	.card-btn-panel {
		width: 325rpx;

		button {
			height: 80rpx;
			width: 260rpx;
			line-height: 80rpx;
			border-radius: 8rpx;
		}
	}

	.idcard-font {
		font-size: 230rpx;
	}
</style>
