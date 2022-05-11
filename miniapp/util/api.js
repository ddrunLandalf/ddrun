import {put} from './request.js'

// 接单
export const orderReceive = async (orderNo) => {
	uni.showLoading();
	const res = await put('order/receive',{orderNo});
	uni.hideLoading()
	if(res.code === 200){
		uni.showToast({
			icon: 'success',
			title: '接单成功'
		})
		return true
	}
	return false
}

// 确认送达
export const orderDeliver = async (orderNo) => {
	return new Promise((resovle) => {
		uni.showModal({
			title: '提示',
			content: '请确认已送达？',
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			async complete(e) {
				if(e.confirm){
					const res = await put('order/deliver',{orderNo});
					if(res.code === 200){
						uni.showToast({
							icon: 'success',
							title: '确认成功'
						})
						resovle(true)
					}
					resovle(false)
				}else{
					resovle(false)
				}
			}
		})
	})
}

export const orderComplete = async (orderNo) => {
	return new Promise((resovle) => {
		uni.showModal({
			title: '提示',
			content: '请尽量让客户确认完成订单，确定要帮用户确认订单？',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			async complete(e) {
				if(e.confirm){
					const res = await put('order/complete',{orderNo});
					if(res.code === 200){
						uni.showToast({
							icon: 'success',
							title: '已完成订单'
						})
						resovle(true)
					}
					resovle(false)
				}else{
					resovle(false)
				}
			}
		})
	})
}

export const orderCompleteByUser = async (orderNo) => {
	return new Promise((resovle) => {
		uni.showModal({
			title: '提示',
			content: '确定订单已送达？',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			async complete(e) {
				if(e.confirm){
					const res = await put('order/complete/user',{orderNo});
					if(res.code === 200){
						uni.showToast({
							icon: 'success',
							title: '已完成订单'
						})
						resovle(true)
					}
					resovle(false)
				}else{
					resovle(false)
				}
			}
		})
	})
}