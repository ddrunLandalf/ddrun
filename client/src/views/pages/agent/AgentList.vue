<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex md3 lg2>
        <v-text-field
          v-model="query.phone_number"
          label="手机号"
          class="pr-2"
          v-on:keyup.enter="getList()"
        ></v-text-field>
      </v-flex>
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
          v-model="query.city_name"
          label="城市名称"
          class="pr-2"
          v-on:keyup.enter="getList()"
        ></v-text-field>
      </v-flex>
      <v-flex md3 lg2>
        <v-select
          v-model="query.cross_city_service"
          :items="[{label:'全部',value:''},{label:'支持',value:1},{label:'不支持',value:0}]"
          label="跨城服务"
          item-text="label"
          item-value="value"
          @change="getList()"
        ></v-select>
      </v-flex>
      <v-flex md3 lg2>
        <v-select
          v-model="query.is_serve"
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
        <v-btn color="success" @click="statusChange(1)">启用服务</v-btn>
        <v-btn color="warning" @click="statusChange(0)">暂停服务</v-btn>
        <v-btn color="success" @click="crossChange(1)">开启跨城服务</v-btn>
        <v-btn color="warning" @click="crossChange(0)">关闭跨城服务</v-btn>
        <v-btn color="dark" @click="dialog = true,tempAgent={city_name:'全国',id:0}">全国设置</v-btn>
        <v-btn color="dark" @click="dialog2 = true">添加代理</v-btn>
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
          <el-table-column label="城市">
            <template slot-scope="scope">
              <div>{{scope.row.city_name || '-- -- --'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <div>{{scope.row.wx_id ?  scope.row.realname:'未绑定微信'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机号">
            <template slot-scope="scope">
              <div>{{scope.row.wx_id ?scope.row.phone_number:'未绑定微信'}}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="admin_name" label="跨城服务">
            <template slot-scope="scope">
              <div>
                <v-chip
                  v-if="scope.row.cross_city_service == 1"
                  class="ma-2"
                  text-color="white"
                  color="green"
                  small
                >支持</v-chip>
                <v-chip
                  v-if="scope.row.cross_city_service == 0"
                  class="ma-2"
                  text-color="white"
                  color="warning"
                  small
                >不支持</v-chip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="状态">
            <template slot-scope="scope">
              <div>
                <v-chip
                  v-if="scope.row.is_serve == 1"
                  class="ma-2"
                  text-color="white"
                  color="green"
                  small
                >启用</v-chip>
                <v-chip
                  v-if="scope.row.is_serve == 0"
                  class="ma-2"
                  text-color="white"
                  color="warning"
                  small
                >禁用</v-chip>
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
                      <v-list-tile >
                        <v-list-tile-title v-text="'查看详情'" @click="tempAgent = scope.row,dialog = true" />
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
    <agent-data v-model="dialog" :agent="tempAgent" @change="updateMsgChange" @changemsg="changeMsg" />
    <agent-add v-model="dialog2"  @change="addminChange" @changemsg="changeMsg" />
  </v-container>
</template>
<script>
import agentAdd from "./AgentAdd";
import agentData from './AgentData';
let _this;
export default {
  components: { agentAdd,agentData },
  data() {
    return {
      items: [],
      query: {
        phone_number: "",
        realname: "",
        city_name: "",
        cross_city_service: "",
        is_serve: "",
        sorts: "erd_agent.id asc",
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
      this.$post("agent/list", this.query, function(res) {
        _this.tableLoad = false;
        if (res.errno === 0) {
          _this.items = res.data.data;
          _this.total = res.data.count;
        }
      });
    },
    //重置搜索
    resetSearch() {
      this.query.admin_name = "";
      this.query.role_name = "";
      this.query.tel_number = "";
      this.query.realname = "";
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
    statusChange(status) {
      if (this.$checkSelect(this.multipleSelection)) {
        this.$post(
          "agent/serve",
          {
            ids: this.getIds().toString(),
            is_serve: status
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
      }
    },

    //启用或禁用
    crossChange(status){
      if (this.$checkSelect(this.multipleSelection)) {
        this.$post(
          "agent/cross",
          {
            ids: this.getIds().toString(),
            cross_city_service: status
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
      }
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
              "agent/recover",
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
