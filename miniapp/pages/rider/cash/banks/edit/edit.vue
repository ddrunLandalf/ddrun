<template>
	<view class="p-30">
		<view class="fo-50">请完善银行卡信息</view>

		<input class="fo-40 border-b mt-30 h-100" v-model="bankName" type="text" placeholder="输入开户行"></input>

		<input class="fo-40 border-b mt-30 h-100" v-model="realname" type="text" placeholder="您的真实姓名"></input>

		<input class="fo-40 border-b mt-30 h-100" v-model="cardNo" placeholder="卡号"></input>

		<view class="py-30 fo-26 fo-9">如果要提现到支付宝，开户行请填写“支付宝”，卡号填写支付宝账号</view>
		<view class="py-30 mt-30">
			<ClassicBtn label="提交" @click="submit()" />
		</view>
		<view class="py-30 " v-if="type === 'update'">
			<view class="fo-price text-center fo-28" @click="delBankCard()">
				删除银行卡
			</view>
		</view>
	</view>
</template>

<script>
	import ClassicBtn from '@/components/classic/Button/ClassicButton.vue'
	import {
		post,
		put,
		del
	} from '@/util/request.js'
	export default {
		components: {
			ClassicBtn
		},
		data() {
			return {
				realname: '',
				cardNo: '',
				bankName: '',
				type: 'add',
				bankNo: ''
			};
		},
		onLoad(options) {
			if (options.bankNo) {
				this.type = 'update'
				this.realname = options.realname
				this.cardNo = options.cardNo
				this.bankName = options.bankName
				this.bankNo = options.bankNo
			}
			uni.setNavigationBarTitle({
				title: this.type === 'add' ? '添加银行卡' : '修改银行卡'
			})
		},
		methods: {
			delBankCard() {
				uni.showModal({
					title: '提示',
					content: '删除后数据无法恢复，确定要删除吗？',
					confirmText: '确定',
					complete: async (e) => {
						if (e.confirm) {
							uni.showLoading({
								title: '正在删除'
							})
							const res = await del('bank/del', {
								bankNo: this.bankNo
							});
							uni.hideLoading()
							if (res.code === 200) {
								uni.navigateBack({
									delta: 1
								})
							}
						}
					}
				})
			},
			async submit() {
				uni.showLoading()
				const formData = {
					realname: this.realname,
					cardNo: this.cardNo,
					bankName: this.bankName,
				}
				if (this.type === 'update') {
					formData.bankNo = this.bankNo
				}
				const res = await (this.type === 'add' ? post('bank/add', formData) : put('bank/update', formData));
				uni.hideLoading()
				if (res.code === 200) {
					uni.showToast({
						title: res.msg,
						icon: 'success'
					})
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
