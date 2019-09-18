<template>
  <v-dialog v-model="thisValue" persistent max-width="800px" min-height="500px">
    <v-card>
      <v-toolbar id="core-toolbar" color="dark" prominent>
        <div class="v-toolbar-title">
          <v-toolbar-title class="white--text font-weight-light">{{thisUser.role_name}}的权限</v-toolbar-title>
        </div>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="thisValue = false">
            <v-icon>el-icon-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-layout justify-center align-center>
        <v-flex xs6 md6 lg6 sm6>
          <v-card-text>
            <v-treeview
              v-model="selection"
              :items="items"
              selected-color="green"
              open-on-click
              selectable
              return-object
            ></v-treeview>
          </v-card-text>
        </v-flex>

        <v-divider vertical></v-divider>

        <v-flex xs12 md6 lg6 sm12>
          <v-card-text>
            <div
              v-if="selection.length === 0"
              key="title"
              class="title font-weight-light grey--text pa-4 text-center"
            >为{{thisUser.role_name}}添加一些权限</div>

            <v-scroll-x-transition group hide-on-leave>
              <v-chip v-for="(item, i) in selection" :key="i" color="grey" dark small class="ma-1">
                <v-icon left small>mdi-beer</v-icon>
                {{ item.name }}
              </v-chip>
            </v-scroll-x-transition>
          </v-card-text>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>

      <v-card-actions class="justify-space-between">
        <v-btn color="gray darken-1" @click="selection = []">清空权限</v-btn>
        <v-btn class="white--text" color="dark darken-1" v-loading="loading" depressed @click="submit">
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style>
    .v-toolbar:not(.v-toolbar--fixed) .v-toolbar__content{
        margin-left: 0
    }
</style>
<script>
let _this;
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    user: {
      type: Object,
      required: true,
      default: {
        id: "",
        role_name: "XX"
      }
    }
  },
  data() {
    return {
      thisValue: this.value,
      loading: false,
      thisUser: this.user,
      auth: [],
      isLoading: false,
      selection:[],
      items:[],
      selData:[]
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    },
    user(val) {
      this.thisUser = val;
      this.getAuth();
      this.getOwnData()
    },
    
  },
  mounted() {
    _this = this;
  },
 
  methods: {
    //获取权限列表
    getAuth() {
      this.$post("authority/list", {}, function(res) {
        if (res.errno == 0) {
          _this.auth = res.data;
          let arr = [];
          for(let i in res.data){
              arr.push({id:res.data[i].id+'_',name:res.data[i].cate_name,children:[]});
              for(let j in res.data[i].authority){
                  arr[i].children.push({id:res.data[i].authority[j].id,name:res.data[i].authority[j].auth_name})
              }
          }
          _this.items = [{
              id:'q1',
              name: '全部权限',
              children: arr
          }];
          
        }
      });
    },
    //查询已拥有的权限
    getOwnData(){
        this.$post('authority/own',{
            role_id:this.thisUser.id
        },function(res){
            if(res.errno === 0){
                _this.selData = JSON.parse(JSON.stringify(res.data));
                _this.selection = JSON.parse(JSON.stringify(res.data));
            }
        })
    },
    //过滤新增的权限
    filterNewAuth(){
        if(this.selection.length > this.selData.length){
            let arr = [];
            for(let i in this.selection){
                let temp = -1;
                for(let j in this.selData){
                    if(this.selection[i].id == this.selData[j].id){
                        temp = j
                    }
                }
                if(temp == -1 && typeof this.selection[i].id == 'number'){
                    arr.push({auth_id:this.selection[i].id,role_id:this.thisUser.id})
                }
            }
            return arr.length > 0 ? {arr:arr,type:'give'}:false
        }else if(this.selection.length < this.selData.length){
            let arr = [];
            for(let i in this.selData){
                let temp = -1;
                for(let j in this.selection){
                    if(this.selection[j].id == this.selData[i].id){
                        temp = j
                    }
                }
                if(temp == -1 && typeof this.selection[i].id == 'number'){
                    arr.push(this.selection[i].id)
                }
            }
            return arr.length > 0 ? {arr:arr,type:'del'}:false
        }else{
            return false
        }
        
    },
    //保存
    submit() {
      let cor = this.filterNewAuth();
      if(cor){
          this.loading = true;
          this.$post(
            "authority/"+cor.type,
            {
              array:cor.type == 'del' ?cor.arr.toString():JSON.stringify(cor.arr),
              role_id: this.thisUser.id
            },
            function(res) {
              _this.loading = false;
              if (res.errno == 0) {
                _this.$message({
                  showClose: true,
                  message: res.errmsg,
                  type: "success"
                });
                _this.thisValue = false;
                _this.$emit("changemsg", res);
              }
            }
          );
      }
    }
  }
};
</script>