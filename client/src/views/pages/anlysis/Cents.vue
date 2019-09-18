<template>
  <v-container fluid grid-list-xl>
    
    <v-layout row wrap>
      <v-flex md3 lg2>
        <v-text-field
          v-model="query.realname"
          label="真实姓名"
          class="pr-2"
          v-on:keyup.enter="getList()"
        ></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-text-field
          v-model="query.id_number"
          label="身份证号"
          class="pr-2"
          v-on:keyup.enter="getList()"
        ></v-text-field>
      </v-flex>

      <v-flex md3 lg2>
        <v-select
          v-model="query.status"
          :items="[{label:'全部',value:'2,3,4'},{label:'正常',value:2},{label:'停止服务',value:3},{label:'停止服务并冻结账户',value:4}]"
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
        <!-- <v-btn color="success" @click="statusChange(1)">启用账号</v-btn>
        <v-btn color="warning" @click="statusChange(0)">禁用账号</v-btn> -->
        <!-- <v-btn color="dark" @click="dialog2 = true">添加管理员</v-btn> -->
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
          <el-table-column prop="data_time" label="日期"></el-table-column>
          
          <el-table-column prop="platform_profit_total" label="平台收益">
            <template slot-scope="scope">
              <div>{{scope.row.platform_profit_total}} 元</div>
            </template>
          </el-table-column>
          <el-table-column prop="runman_profit_total" label="跑男收益">
            <template slot-scope="scope">
              <div>{{scope.row.runman_profit_total}} 元</div>
            </template>
          </el-table-column>
          <el-table-column prop="agent_profit_total" label="代理收益">
            <template slot-scope="scope">
              <div>{{scope.row.agent_profit_total}} 元</div>
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
  </v-container>
</template>
<script>
let _this;
export default {
  data() {
    return {
      items: [],
      query: {
        id_number: "",
        realname: "",
        status: "2,3,4",
        ws_type: 2,
        currentPage: 1,
        pageSize: 10
      },
      multipleSelection: [],
      pageSizes: this.$pageSizes,
      tableLoad: false,
      total: 0,
      dialog: false,
      dialog2: false,
      tempUser: {},
      pageLoad:false
    };
  },
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    load(val) {
      if (val) {
        this.pageLoad = val;
      }
    },
    pageLoad(val) {
      if (val) {
        this.getList();
      }
    }
  },
  mounted() {
    _this = this;
    // this.getList();
  },
  methods: {
    //获取列表
    getList() {
      _this.tableLoad = true;
      _this.$post("anlysis/order/list", this.query, function(res) {
        _this.tableLoad = false;
        if (res.errno === 0) {
          _this.items = res.data.data;
          _this.total = res.data.count;
        }
      });
    },
    //添加为分销员
    
    //重置搜索
    resetSearch() {
      this.query.id_number = "";
      this.query.realname = "";
      this.query.status = "2,3,4";
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

    //启用或禁用
    statusChange(id,status) {
        this.$post(
          "admin/service/status",
          {
            id: id,
            status: status
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
    },
    //启用或禁用
    noticeChange(id,notice) {
        this.$post(
          "admin/service/notice",
          {
            id: id,
            is_notice: notice
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
