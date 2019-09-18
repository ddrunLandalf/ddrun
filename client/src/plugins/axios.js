import Vue from 'vue'

// Lib imports
import axios from 'axios'
import apiurl from '../../public/js/apiurl'


Vue.prototype.$http = axios;
Vue.prototype.$api = apiurl;
Vue.prototype.$post = post;

function post (url,data,callback) {
    axios.defaults.headers.common['token'] = sessionStorage.getItem('token');
    let _url = apiurl + url;
    axios.post(_url,data)
        .then(function(res){
            if(res.data.errno === 1000){
                Vue.prototype.$message({
                    showClose: true,
                    message: res.data.errmsg,
                    type: 'warning'
                  });
            }else if(res.data.errno === -1){
                if(sessionStorage.getItem('admin_name') && sessionStorage.getItem('admin_pwd')){
                    post('admin/login',{
                        admin_name:sessionStorage.getItem('admin_name'),
                        admin_pwd: sessionStorage.getItem('admin_pwd')
                    },function(e){
                        if(e.errno === 0){
                            sessionStorage.setItem('token',e.data.token)
                            post(url,data,callback)
                        }else{
                            Vue.prototype.$router.push({path:'/login'})
                        }
                    })
                }else{
                    Vue.prototype.$router.push({path:'/login'})
                }
            }
            callback(res.data)
        })
        .catch(function(err){
            callback({data:err,errno:1001})
            Vue.prototype.$message({
                showClose: true,
                message: '服务端错误',
                type: 'error'
              });
        })
}
