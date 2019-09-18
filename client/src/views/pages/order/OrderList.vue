<template>
  <v-container fluid grid-list-xl>
    
    <v-layout row wrap>
      <v-flex md3 lg2>
        <v-text-field v-model="query.order_no" label="订单编号" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-text-field v-model="query.start_address" label="起点" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-text-field v-model="query.end_address" label="终点" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-text-field v-model="query.create_time" label="下单时间" class="pr-2" v-on:keyup.enter="getList()"></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-select
          v-model="query.service_type"
          :items="[{label:'全部类型',value:''},{label:'帮我送',value:'帮我送'},{label:'帮我取',value:'帮我取'},{label:'帮我买',value:'帮我买'},{label:'代驾',value:'代驾'}]"
          label="服务类型"
          item-text="label"
          item-value="value"
          @change="getList()"
        ></v-select>
      </v-flex>
      <v-flex md3 lg2>
        <v-select
          v-model="query.status"
          :items="[{label:'全部状态',value:''},{label:'已支付',value:1},{label:'配送中',value:2},{label:'配送完成',value:3},{label:'已完成',value:4},{label:'交易关闭',value:-1},{label:'已取消',value:-2}]"
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
        <!-- <v-btn color="danger" @click="recover()">删除</v-btn> -->
        
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
          <el-table-column label="订单编号" prop="order_no"></el-table-column>
          <el-table-column label="服务类型" prop="service_type"></el-table-column>
          <el-table-column label="城市">
                <template slot-scope="scope">
                <div>{{scope.row.start_address.city}}</div>
                </template>
            </el-table-column>
            <el-table-column label="起点">
                <template slot-scope="scope">
                <div>{{scope.row.start_address.formatted_addresse+scope.row.start_address.street_number+scope.row.start_address.address_detail}}</div>
                </template>
            </el-table-column>
            <el-table-column label="终点">
                <template slot-scope="scope">
                <div>{{scope.row.end_address.formatted_addresse+scope.row.end_address.street_number+scope.row.end_address.address_detail}}</div>
                </template>
            </el-table-column>
            <el-table-column label="服务路程">
                <template slot-scope="scope">
                <div>{{scope.row.distance}}米</div>
                </template>
            </el-table-column>
            <el-table-column label="支付金额">
                <template slot-scope="scope">
                <div>{{scope.row.pay_amount}}元</div>
                </template>
            </el-table-column>
            <el-table-column prop label="状态">
                <template slot-scope="scope">
                <div>
                    <div v-if="scope.row.status == 0">待付款</div>
                    <div v-if="scope.row.status == 1">已支付</div>
                    <div v-if="scope.row.status == 2">配送中</div>
                    <div v-if="scope.row.status == 3">配送完成</div>
                    <div v-if="scope.row.status == 4">已完成</div>
                    <div v-if="scope.row.status == -1">交易关闭</div>
                    <div v-if="scope.row.status == -2">已取消</div>
                    <div v-if="scope.row.status == -2">
                        <div class="caption">退款金额: {{scope.row.refund_amount}}元</div>
                    </div>
                </div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="create_time"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                <v-menu
                  offset-y
                  content-class="dropdown-menu"
                  transition="slide-y-transition">
                  <v-btn
                    small
                    slot="activator"
                    color="success"
                  >
                    展开操作
                  </v-btn>
                  <v-card>
                    <v-list dense>
                      <v-list-tile @click="tempData = scope.row,dialog = true">
                        <v-list-tile-title v-text="'查看详情'"  />
                      </v-list-tile>
                      <v-list-tile v-if="scope.row.status == 1" >
                        <v-list-tile-title v-text="'派单'" @click="tempAgent = scope.row,dialog = true" />
                      </v-list-tile>
                      <v-list-tile v-if="scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 2">
                        <v-list-tile-title v-text="'取消订单'" @click="tempAgent = scope.row,dialog = true" />
                      </v-list-tile>
                      <v-list-tile v-if="scope.row.status == 3" >
                        <v-list-tile-title v-text="'确认完成'" @click="tempAgent = scope.row,dialog = true" />
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-menu>
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
    <detail v-model='dialog' :msg="tempData" :type="roleEditType" @change="updateMsgChange" @changemsg="changeMsg" />
    <!-- <authority v-model='dialog2' :user="tempData" @change="authorityChange" @changemsg="changeMsg" /> -->
  </v-container>
</template>
<script>
import detail from './OrderDetail'
// import Authority from './Authority'
let _this ;
export default {
  components:{ detail },

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
      roleEditType:'add',
      items: [],
      query:{
        order_no:'',
        start_address:'',
        end_address:'',
        service_type:'',
        status:'',
        create_time:'',
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
        this.$post('admin/order/list',this.query,function(res){
            _this.tableLoad = false;
            if(res.errno === 0){
                for(let i in res.data.data){
                    res.data.data[i].start_address = JSON.parse(res.data.data[i].start_address);
                    res.data.data[i].end_address = JSON.parse(res.data.data[i].end_address);
                }
                _this.items = res.data.data;
                _this.total = res.data.count;
            }
        })
    },
    //重置搜索
    resetSearch(){
        this.query.order_no = '';
        this.query.start_address='';
        this.query.end_address='';
        this.query.service_type='';
        this.query.create_time='';
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
