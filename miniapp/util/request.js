import {
	API
} from './constant.js'



export const request = async (url, data, method, needNo = true) => {
	const wxappNo = needNo ? await getWxappNo() : undefined
	return new Promise((resolve) => {
		uni.request({
			url: API + url,
			data,
			method,
			header: {
				'wxappno': wxappNo
			},
			complete: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code !== 200) {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}
					if(res.data.code === 203){
						uni.navigateTo({
							url: '/pages/login/login'
						})
						return;
					} 
					resolve(res.data)
					
				} else {
					resolve({
						code: 9999,
						msg: 'error'
					})
					uni.showToast({
						icon: 'error',
						title: '服务端错误'
					})
				}
			}
		});
	})
}

export const post = (url, data) => {
	return request(url, data, 'POST')
}

export const put = (url, data) => {
	return request(url, data, 'PUT')
}

export const del = (url, data) => {
	return request(url, data, 'DELETE')
}

export const $get = (url, data, needNo) => {
	return request(url, data, 'GET', needNo)
}

export const getWxappNo = async () => {
	let wxappNo = uni.getStorageSync('wxappNo');
	if (!wxappNo) {
		wxappNo = await login();
	}
	return wxappNo
}

export const login = () => {
	return new Promise((resolve) => {
		uni.getProvider({
			service: 'oauth',
			complete: (res) => {
				const provider = res.provider[0];
				uni.login({
					provider,
					success: async (res) => {
						if (provider === 'weixin') {
							const result = await $get('wxapp/login', {
								code: res.code
							}, false)
							uni.setStorageSync('wxappNo', result.data.wxappNo)
							if(result.data.user){
								uni.setStorageSync('userInfo',result.data.user)
							}
							resolve(result.data.wxappNo)
						}
					},
				});
			}
		});
	})
}

export const info = async () => {
	const res = await $get('user/info');
	if(res.code === 200){
		uni.setStorageSync('userInfo',res.data)
	}
}


export const upload = async (filePath) => {
	return new Promise((resolve)=>{
		uni.uploadFile({
			url: API + 'upload/put',
			filePath,
			name: 'file',
			formData: {},
			complete(e) {
				if(e.statusCode === 200){
					const json = JSON.parse(e.data);
					if(json.code === 200){
						resolve(json.data)
					}else{
						uni.showToast({
							icon: 'none',
							msg: json.msg
						})
						resolve('')
					}
				}else{
					uni.showToast({
						icon: 'none',
						msg: '上传图片失败'
					})
					resolve('')
				}
			}
		})
	})
}