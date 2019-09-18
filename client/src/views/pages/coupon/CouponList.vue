<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex md3 lg2>
        <v-text-field
          v-model="query.coupon_name"
          label="优惠券名称"
          class="pr-2"
          v-on:keyup.enter="getList()"
        ></v-text-field>
      </v-flex>
      
      <v-flex md3 lg2>
        <v-select
          v-model="query.status"
          :items="[{label:'全部',value:''},{label:'可领取',value:1},{label:'停止领取',value:2},{label:'停用优惠券',value:3}]"
          label="状态"
          item-text="label"
          item-value="value"
          @change="getList()"
        ></v-select>
      </v-flex>
      <v-flex md3 lg2>
        <v-select
          v-model="query.limit_service"
          :items="[{label:'全部',value:''},{label:'不限制服务',value:0},{label:'限制服务',value:1}]"
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
        <v-btn color="red" @click="recover()">删除</v-btn>
        <v-btn color="dark" @click="dialog2 = true">添加优惠券</v-btn>
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
          item-value="value"
          label="每页条数"
          class="pr-2 inline-block"
          required
        ></v-select>
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
          <el-table-column label="ID" prop="id" width="70"></el-table-column>
          <el-table-column label="优惠券名称" prop="coupon_name"> 
            <template slot-scope="scope">
              <div>{{scope.row.coupon_name}}</div>
              <div>{{scope.row.create_time}}</div>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额" > 
            <template slot-scope="scope">
              <div>{{scope.row.discount_amount}}元</div>
            </template>
          </el-table-column>
          <el-table-column label="最低消费" > 
            <template slot-scope="scope">
              <div>{{scope.row.conditions_amount}}元</div>
            </template>
          </el-table-column>
          <el-table-column label="有效天数">
            <template slot-scope="scope">
              <div>{{scope.row.deadline_days}}天</div>
            </template>
          </el-table-column>
          <el-table-column label="领取数量">
            <template slot-scope="scope">
              <div>{{scope.row.limit_no == -1 ? '不限制':scope.row.limit_no+'次'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="使用人数">
            <template slot-scope="scope">
              <div>{{scope.row.cumulative_use_no}}人</div>
            </template>
          </el-table-column>
          <el-table-column label="领取人数">
            <template slot-scope="scope">
              <div>{{scope.row.cumulative_draw_no}}人</div>
            </template>
          </el-table-column>
          <el-table-column label="使用限制">
            <template slot-scope="scope">
              <div>{{scope.row.limit_service == 0 ? '不限制': scope.row.condition_service}}</div>
            </template>
          </el-table-column>
         
          <el-table-column prop label="状态">
            <template slot-scope="scope">
              <div>
                <v-chip
                  v-if="scope.row.status == 1"
                  class="ma-2"
                  text-color="white"
                  color="green"
                  small
                >可领取</v-chip>
                <v-chip
                  v-if="scope.row.status == 2"
                  class="ma-2"
                  text-color="white"
                  color="warning"
                  small
                >停止领取</v-chip>
                <v-chip
                  v-if="scope.row.status == 3"
                  class="ma-2"
                  text-color="white"
                  color="red"
                  small
                >停止使用</v-chip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
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
                      <v-list-tile @click="tempAgent = scope.row,dialog = true">
                        <v-list-tile-title v-text="'查看领取记录'"  />
                      </v-list-tile>
                      <v-list-tile @click="tempAgent = scope.row,dialog = true">
                        <v-list-tile-title v-text="'修改'"  />
                      </v-list-tile>
                      
                    </v-list>
                  </v-card>
                </v-menu>
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
    <coupon-update v-model="dialog" :msg="tempAgent" @change="updateMsgChange" @changemsg="changeMsg" />
    <coupon-add v-model="dialog2"  @change="addminChange" @changemsg="changeMsg" />
  </v-container>
</template>
<script>
import couponAdd from "./CouponAdd";
import couponUpdate from './CouponUpdate';
let _this;
export default {
  components: { couponAdd,couponUpdate },
  data() {
    return {
      items: [],
      query: {
        coupon_name: "",
        status: "",
        limit_service: "",
        currentPage: 1,
        pageSize: 10
      },
      multipleSelection: [],
      pageSizes: this.$pageSizes,
      tableLoad: false,
      total: 0,
      dialog: false,
      dialog2: false,
      tempAgent: {}
    };
  },
  mounted() {
    _this = this;
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      this.tableLoad = true;
      this.$post("coupon/list", this.query, function(res) {
        _this.tableLoad = false;
        if (res.errno === 0) {
          _this.items = res.data.data;
          _this.total = res.data.count;
        }
      });
    },
    //重置搜索
    resetSearch() {
      this.query.coupon_name = "";
      this.query.status = "";
      this.query.limit_service = "";
      this.getList();
    },

    //选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //获取id
    getIds() {
      let arr = [];
      for (let i in this.multipleSelection) {
        arr.push(this.multipleSelection[i].id);
      }
      return arr;
    },

    //跳转页码
    handleCurrentChange(val) {
      this.query.currentPage = val;
      this.getList();
    },

    //回收
    recover() {
      if (this.$checkSelect(this.multipleSelection)) {
        this.$confirm("删除否此数据将无效，可在回收站恢复, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$post(
              "coupon/recover",
              {
                ids: this.getIds().toString()
              },
              function(res) {
                if (res.errno == 0) {
                  _this.$message({
                    showClose: true,
                    message: res.errmsg,
                    type: "success"
                  });
                  _this.getList();
                }
              }
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    //绑定对话框的值
    updateMsgChange(val) {
      this.dialog = val;
    },
    addminChange(val) {
      this.dialog2 = val;
    },
    //更新值
    changeMsg(e) {
      this.getList();
    }
  }
};
</script>
