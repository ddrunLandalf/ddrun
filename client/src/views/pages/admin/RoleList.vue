<template>
  <v-container fluid grid-list-xl>
    
    <v-layout row wrap>
      <v-flex md3 lg2>
        <v-text-field v-model="query.id" label="ID" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-text-field v-model="query.role_name" label="角色名称" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-text-field v-model="query.remarks" label="备注" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-select
          v-model="query.status"
          :items="[{label:'全部',value:''},{label:'启用',value:1},{label:'禁用',value:0}]"
          label="状态"
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
        <v-btn color="danger" @click="recover()">删除</v-btn>
        <v-btn color="success" @click="statusChange(1)">启用角色</v-btn>
        <v-btn color="warning" @click="statusChange(0)">禁用角色</v-btn>
        <v-btn color="dark" @click="roleEditType='add',dialog=true">添加角色</v-btn>
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
          <el-table-column label="序号" prop="sort" width="60"></el-table-column>
            <el-table-column label="角色名称">
                <template slot-scope="scope">
                <div>{{scope.row.id}}:{{scope.row.role_name || '-- -- --'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                <div>{{scope.row.remarks || '-- -- --'}}</div>
                </template>
            </el-table-column>
            <el-table-column prop label="状态">
                <template slot-scope="scope">
                <div>
                    <v-chip v-if="scope.row.status == 1" class="ma-2" text-color="white" color="green" small>启用</v-chip>
                    <v-chip v-if="scope.row.status == 0" class="ma-2" text-color="white" color="warning" small>禁用</v-chip>
                </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                <div>
                    <v-btn color="dark" dark small @click="dialog = true,roleEditType='update',tempData = scope.row">修改</v-btn>
                    <v-btn color="dark" dark small @click="dialog2 = true,tempData = scope.row">权限</v-btn>
                </div>
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
    <role-edit v-model='dialog' :msg="tempData" :type="roleEditType" @change="updateMsgChange" @changemsg="changeMsg" />
    <authority v-model='dialog2' :user="tempData" @change="authorityChange" @changemsg="changeMsg" />
  </v-container>
</template>
<script>
import roleEdit from './RoleEdit'
import Authority from './Authority'
let _this ;
export default {
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
  components:{ roleEdit,Authority },
  data() {
    return {
      pageLoad: false,
      roleEditType:'add',
      items: [],
      query:{
        role_name:'',
        remarks:'',
        status:'',
        id:'',
        sorts:'sort asc',
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
      
  },
  methods: {
    //获取列表
    getList(){
        this.tableLoad = true;
        this.$post('role/list',this.query,function(res){
            _this.tableLoad = false;
            if(res.errno === 0){
                _this.items = res.data.data;
                _this.total = res.data.count;
            }
        })
    },
    //重置搜索
    resetSearch(){
        this.query.id = '';
        this.query.role_name='';
        this.query.remarks='';
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
            this.$post('role/status',{
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
            this.$post('role/recover',{
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
