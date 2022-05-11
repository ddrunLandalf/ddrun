<template>
	<view class="p-30 border-t fo-28">
		<rich-text type="text" :nodes="node"></rich-text>
	</view>
</template>

<script>
	import { $get } from '@/util/request.js'
	export default {
		data() {
			return {
				node:'',
				type: 'user' // user rider riderAgreement骑手协议
			};
		},
		onLoad(options) {
			if(options.type){
				let title = '';
				switch(options.type){
					case 'user': 
						title = '用户指南';break;
					case 'rider':
						title = '骑手指南';break;
					case 'riderAgreement':
						title = '骑手协议';break;
				}
				uni.setNavigationBarTitle({
					title
				})
				this.type = options.type
				this.getText()
			}
		},
		methods: {
			async getText(){
				const res = await $get('home/text', {
					type: this.type
				});
				if(res.code === 200 && res.data.content){
					this.node = res.data.content
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
