<template>
  <v-container fluid grid-list-xl>
    
    <v-layout row wrap>
      <v-flex md3 lg2>
        <v-text-field v-model="query.app_key" label="api key" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-text-field v-model="query.app_name" label="应用名称" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      
      <v-flex md3 lg2>
        <v-select
          v-model="query.status"
          :items="[{label:'全部状态',value:''},{label:'允许访问',value:1},{label:'禁止访问',value:0}]"
          label="订单状态"
          item-text="label"
          item-value="value"
          @change="getList()"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs-12 md-12 lg-12 sm-12>
        <v-btn color="gray" @click="resetSearch()">重置</v-btn>
        <v-btn color="dark" @click="getList()">
          <v-icon size="14">mdi-account-search</v-icon>&nbsp;搜索
        </v-btn>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout wrap justify-space-between>
      <v-flex sm8 xs12 md8 lg8>
        <v-btn color="red" @click="recover()">删除</v-btn>
        <v-btn color="warning" @click="statusChange(0)">禁止访问</v-btn>
        <v-btn color="success" @click="statusChange(1)">允许访问</v-btn>
        <v-btn color="dark" @click="dialog = true,editType='add'">新增应用</v-btn>
        
        <v-btn color="gray" class="inline-block" icon @click="getList()">
          <v-icon>mdi-autorenew</v-icon>
        </v-btn>
      </v-flex>
      <div>
        <v-select 
          v-model="query.pageSize"
          :items="pageSizes"
          item-text="label"
          @change="getList()"
          item-value="value" label="每页条数" class="pr-2 inline-block" required></v-select>
      </div>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs-12 md-12 lg-12 sm-12>
        <el-table
          ref="multipleTable"
          :data="items"
          tooltip-effect="dark"
          style="width: 100%"
          border
          v-loading="tableLoad"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="应用名称" prop="app_name"></el-table-column>
          <el-table-column label="api key" prop="app_key"></el-table-column>
          <el-table-column label="ip白名单" prop="ip_white_list"></el-table-column>
          <el-table-column label="回调地址" prop="cb_url"></el-table-column>
          <el-table-column label="累计访问量" prop="grant_visit_no"></el-table-column>
            <el-table-column prop label="状态">
                <template slot-scope="scope">
                   <v-chip
                      v-if="scope.row.status == 1"
                      class="ma-2"
                      text-color="white"
                      color="green"
                      small
                    >允许访问</v-chip>
                    <v-chip
                      v-if="scope.row.status == 0"
                      class="ma-2"
                      text-color="white"
                      color="warning"
                      small
                    >禁止访问</v-chip>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="create_time"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                  <v-btn class="dark" @click="editType='update',tempData=scope.row,dialog=true">修改</v-btn>
                </template>
            </el-table-column>
         </el-table>
      </v-flex>
    </v-layout>
    <v-layout wrap justify-end mt-3>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="query.currentPage"
        :page-size="query.pageSize"
        layout="total,  prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </v-layout>
    <edit v-model='dialog' :msg="tempData" :type="editType" @change="updateMsgChange" @changemsg="changeMsg" />

  </v-container>
</template>
<script>
import edit from './OpentpEdit'
let _this ;
export default {
  components:{ edit },

  props:{
      load:{
          type: Boolean,
          default:false
      }
  },
  watch:{
      load(val) {
          if(val){
              this.pageLoad = val
          }
      },
      pageLoad(val){
          if(val){
            this.getList();
          }
      }
  },
  data() {
    return {
      pageLoad: false,
      editType:'add',
      items: [],
      query:{
        app_key:'',
        app_name:'',
        status:'',
        currentPage:1,
        pageSize:10
      },
      multipleSelection:[],
      pageSizes: this.$pageSizes,
      tableLoad:false,
      total:0,
      dialog:false,
      dialog2:false,
      tempData:{}
    };
  },
  mounted(){
      _this = this;
      this.getList();
  },
  methods: {
    //获取列表
    getList(){
        this.tableLoad = true;
        this.$post('admin/opentp/list',this.query,function(res){
            _this.tableLoad = false;
            if(res.errno === 0){
                _this.items = res.data.data;
                _this.total = res.data.count;
            }
        })
    },
    //重置搜索
    resetSearch(){
        this.query.app_key = '';
        this.query.app_name='';
        this.query.status='';
        this.getList();
    },

    //选中
    handleSelectionChange(val){
        this.multipleSelection = val;
    },

    //获取id
    getIds(){
        let arr = [];
        for(let i in this.multipleSelection){
            arr.push(this.multipleSelection[i].id)
        }
        return arr
    },

    //跳转页码
    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getList();
    },

    //启用或禁用
    statusChange(status){
        if(this.$checkSelect(this.multipleSelection)){
            this.$post('admin/opentp/status',{
              ids: this.getIds().toString(),
              status: status
            },function(res){
              if(res.errno == 0){
                _this.$message({
                    showClose: true,
                    message: res.errmsg,
                    type: 'success'
                })
                _this.getList()
              }
            })
        }
    },

    //回收
    recover(){
      if(this.$checkSelect(this.multipleSelection)){
          this.$confirm('删除否此数据将无效，可在回收站恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$post('admin/opentp/recover',{
              ids: this.getIds().toString()
            },function(res){
              if(res.errno == 0){
                _this.$message({
                    showClose: true,
                    message: res.errmsg,
                    type: 'success'
                })
                _this.getList()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
            
        }
    },
    //绑定对话框的值
    updateMsgChange(val) {
      this.dialog = val
    },
    authorityChange(val){
      this.dialog2 = val
    },
    //更新值
    changeMsg(e){
      this.getList()
    }

  }
};
</script>
