<template>
  <v-container fluid grid-list-xl>
   
    <v-layout row wrap>
      
      <v-flex md3 lg2>
        <v-text-field
          v-model="query.nick_name"
          label="昵称"
          class="pr-2"
          v-on:keyup.enter="getList()"
        ></v-text-field>
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
        <v-btn color="red" @click="del()">删除</v-btn>
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
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="头像">
            <template slot-scope="scope">
              <div>
                <v-avatar>
                  <img
                    :src="scope.row.avatar_url || 'https://cdn.vuetifyjs.com/images/john.jpg'"
                    alt="John"
                  />
                </v-avatar>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nick_name" label="昵称"></el-table-column>
          <el-table-column prop="gender" label="性别">
            <template slot-scope="scope">
              <div>{{scope.row.gender == 1 ? '男':'女'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fans" label="粉丝">
            <template slot-scope="scope">
              <div>{{scope.row.s_no+scope.row.f_no}}人</div>
            </template>
          </el-table-column>
          <el-table-column prop="commission" label="佣金">
            <template slot-scope="scope">
              <div>{{scope.row.surplus_amount}}元</div>
            </template>
          </el-table-column>
          <el-table-column prop="grand_cash" label="累计提现">
            <template slot-scope="scope">
              <div>{{scope.row.grand_cash}}元</div>
            </template>
          </el-table-column>
          <el-table-column prop="integral" label="积分">
            <template slot-scope="scope">
              <div>{{scope.row.surplus_integral}}分</div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div>
                <v-chip
                  v-if="scope.row.status == 1"
                  class="ma-2"
                  text-color="white"
                  color="green"
                  small
                >正常</v-chip>
                <v-chip
                  v-if="scope.row.status == 0"
                  class="ma-2"
                  text-color="white"
                  color="red"
                  small
                >封号</v-chip>
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
  </v-container>
</template>
<script>
let _this;
export default {
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [],
      query: {
        nick_name: "",
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
  },
  methods: {
    //获取列表
    getList() {
      _this.tableLoad = true;
      _this.$post("wx/retail/list", this.query, function(res) {
        _this.tableLoad = false;
        if (res.errno === 0) {
          _this.items = res.data.data;
          _this.total = res.data.count;
        }
      });
    },
   
    //重置搜索
    resetSearch() {
      this.query.nick_name = "";
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

    del(){
        if (this.$checkSelect(this.multipleSelection)) {
        this.$confirm("删除将无法恢复, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$post(
              "wx/retail/del",
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
