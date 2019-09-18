import Vue from 'vue'

Vue.prototype.$pageSizes = [
    {label:'每页10条',value:10},
    {label:'每页15条',value:15},
    {label:'每页20条',value:20},
    {label:'每页30条',value:30},
    {label:'每页50条',value:50},
    {label:'每页100条',value:100},
    {label:'每页500条',value:500},
    {label:'每页1000条',value:1000},
    {label:'每页5000条',value:5000},
    {label:'每页10000条',value:10000}
]

Vue.prototype.$checkSelect = function (arr) {
    if(arr.length == 0){
        Vue.prototype.$message({
            showClose: true,
            message: '您还没选择任何一项',
            type: 'info'
        })
        return false
    }else{
        return true
    }
}