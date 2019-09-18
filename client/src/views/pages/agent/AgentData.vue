<template>
  <div>
    <v-dialog v-model="thisValue" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar id="core-toolbar" app color="dark" prominent>
          <div class="v-toolbar-title">
            <v-toolbar-title class="white--text font-weight-light">城市代理信息</v-toolbar-title>
          </div>
          <v-spacer />
          <v-toolbar-items>
            <v-btn icon dark @click="thisValue = false,closeDark()">
              <v-icon>el-icon-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <div style="height:60px"></div>
            <v-layout wrap>
              <v-flex xs12 sm6 lg-4 md-4>
                <v-card class="mx-auto">
                  <v-card-title class="headline">
                    {{thisAgent.city_name}}
                    <v-switch
                      class="ml-4"
                      v-model="thisAgent.is_serve"
                      color="green"
                      @change="statusChange"
                      :label="thisAgent.is_serve == 1 ? '服务已开启':'服务已暂停'"
                    ></v-switch>
                    <v-switch
                      class="ml-4"
                      v-model="thisAgent.cross_city_service"
                      @change="crossChange"
                      color="green"
                      :label="thisAgent.cross_city_service == 1 ? '跨城服务已开启':'跨城服务已关闭'"
                    ></v-switch>
                  </v-card-title>
                  <v-card-text>{{thisAgent.realname}},{{thisAgent.phone_number}}</v-card-text>
                  <v-card-actions>
                    <v-btn color="dark" class="v-btn--simple" @click="dlog = true">更换代理</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
            <v-toolbar id="core-toolbar" color="bg-default" prominent class="mt-4">
              <div class="v-toolbar-title">
                <v-toolbar-title class="tertiary--text font-weight-light">设置服务收益及状态:</v-toolbar-title>
              </div>
              <v-spacer />
              <v-toolbar-items>
                <v-btn
                  dark
                  color="dark"
                  style="height:40px"
                  :loading="serveLoad"
                  @click="updateService"
                >保存设置</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <!-- <p class="red--text">
              示例：起步路程3000米，起步价7元，超出路程1000米，超出路程加价1.5元，最大服务路程20000米。
              <br />表示：3km内支付7元，超出3km每1km加价1.5元，不能超过最大服务路程。
              <br />如：用户的服务路程为16km，那么需支付: 7+(16-3)*1.5 = 26.5元 ；的路程费。
            </p>-->
            <el-table
              :data="serviceRules"
              border
              style="width: 100%"
              type="expand"
              default-expand-all
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div v-if="scope.row.service_type != '代驾'">
                    <el-tag
                      :key="tag"
                      v-for="(tag,tagIndex) in scope.row.des_tags"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(scope.$index,tagIndex)"
                    >{{tag}}</el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.$index)"
                      @blur="handleInputConfirm(scope.$index)"
                    ></el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.$index)"
                    >+ 添加标签</el-button>
                  </div>
                  <div v-if="scope.row.service_type == '代驾'">无需添加内容</div>
                  <div v-if="scope.row.service_type == '帮我买'" class="mt-4">
                    <v-text-field label="就近多少公里内购买" v-model="scope.row.buy_meter"></v-text-field>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="service_type" label="服务名称" width="100px"></el-table-column>
              <el-table-column label="服务状态">
                <template slot-scope="scope">
                  <div>
                    <el-switch
                      v-model="scope.row.open_service"
                      active-color="#13ce66"
                      inactive-color="#e1e1e1"
                      :inactive-value="0"
                      :active-value="1"
                    ></el-switch>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="初始接单时间(分钟)">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.init_time" type="number" placeholder="输入初始接单时间" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="平台收益(%)">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.platform_profit" type="number" placeholder="输入整数" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="代理收益(%)">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.agent_profit" type="number" placeholder="输入整数" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="用户收益(%)">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.user_profit" type="number" placeholder="输入整数" />
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <v-toolbar id="core-toolbar" color="bg-default mt-4" prominent>
              <div class="v-toolbar-title">
                <v-toolbar-title
                  class="tertiary--text font-weight-light"
                >填写路程计价规则: (以下每项都必填，若不填可能会造成功能无法使用)</v-toolbar-title>
              </div>
              <v-spacer />
              <v-toolbar-items>
                <v-btn
                  dark
                  color="dark"
                  style="height:40px"
                  :loading="serveLoad"
                  @click="updateDistance"
                >保存设置</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <p class="red--text">
              示例：起步路程3000米，起步价7元，超出路程1000米，超出路程加价1.5元，最大服务路程20000米。
              <br />表示：3km内支付7元，超出3km每1km加价1.5元，不能超过最大服务路程。
              <br />如：用户的服务路程为16km，那么需支付: 7+(16-3)*1.5 = 26.5元 ；的路程费。
            </p>
            <el-table :data="distanceRules" border style="width: 100%">
              <el-table-column prop="rule_type" label="服务名称" width="100px"></el-table-column>
              <el-table-column label="起步路程(米)">
                <template slot-scope="scope">
                  <div>
                    <el-input
                      v-model="scope.row.start_distance"
                      type="number"
                      placeholder="输入路程，表示该路程内一口价"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="起步价(元)">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.start_price" type="number" placeholder="输入起步价格" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="超出路程(米)">
                <template slot-scope="scope">
                  <div>
                    <el-input
                      v-model="scope.row.exceed_everyone_distance"
                      type="number"
                      placeholder="输入起步价格"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="超出路程加价(元)">
                <template slot-scope="scope">
                  <div>
                    <el-input
                      v-model="scope.row.exceed_everyone_price"
                      type="number"
                      placeholder="输入起步价格"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="最大服务路程(米)">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.max_distance" type="number" placeholder="最大服务路程" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <v-toolbar id="core-toolbar" color="bg-default mt-4" prominent>
              <div class="v-toolbar-title">
                <v-toolbar-title class="tertiary--text font-weight-light">填写重量计价规则:</v-toolbar-title>
              </div>
              <v-spacer />
              <v-toolbar-items>
                <v-btn
                  dark
                  color="dark"
                  style="height:40px"
                  :loading="serveLoad"
                  @click="updateWeight"
                >保存设置</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <p class="red--text">提示：所有的最大重量和最小重量不能出现重复数字，而且最大重量必须大于最小重量。</p>
            <el-table :data="weightRules" border style="width: 100%">
              <el-table-column label="最小重量">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.min_weight" type="number" placeholder="最小重量" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="最大重量">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.max_weight" type="number" placeholder="最大重量" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="价格">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="scope.row.price" type="number" placeholder="价格" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="规则">
                <template slot-scope="scope">
                  <div>{{scope.row.min_weight+'~'+scope.row.max_weight+'g 之间为'+scope.row.price+'元'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="delWeight(scope.$index)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              class="button-new-tag"
              :loading="addload"
              size="small"
              @click="newWeight()"
            >+ 添加一项重量规则</el-button>
            <br />
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dlog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">更换代理</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form2" v-model="valid">
              <v-text-field
                label="手机号（必须是已注册的用户）*"
                :rules="[v => !!v || '手机号必填']"
                required
                v-model="formData.phone_number"
              ></v-text-field>
              <v-text-field
                label="真实姓名*"
                :rules="[v => !!v || '真实姓名必填']"
                required
                v-model="formData.realname"
              ></v-text-field>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn color="blue gray" text @click="dlog = false">取消</v-btn>
          <v-btn color="dark darken-1" :loading="uuload" text @click="updateUser()">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import cityData from ".././../../utils/city.js";
let _this;
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    agent: {
      type: Object
    }
  },
  data() {
    return {
      thisValue: this.value,
      thisAgent: this.agent,
      sloading: false,
      roles: [],
      valid: true,
      cityData: cityData,
      uuload: false,
      dlog: false,
      formData: {
        phone_number: "",
        realname: ""
      },
      serviceRules: [],
      distanceRules: [],
      weightRules: [],
      stload: false,
      serveLoad: false,
      addload: false,
      weightRulesForm: {
        min_weight: "",
        max_weight: "",
        price: ""
      }
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    },
    agent(val) {
      this.thisAgent = val;
      if(val.city_name == '全国'){
        this.findAgent(function(){
          _this.getMsg();
        })
      }else{
        this.getMsg();
      }
    }
  },
  mounted() {
    _this = this;
  },
  methods: {
    //全国
    findAgent(cb){
      this.$post('agent/find',{},function(res){
        if(res.errno === 0){
          _this.thisAgent = res.data;
          cb()
        }
      })
    },
    //改变状态
    statusChange(e) {
      this.updateState("serve", e ? 1 : 0);
    },
    //改变跨城服务
    crossChange(e) {
      this.updateState("cross", e ? 1 : 0);
    },
    updateState(url, value) {
      this.$post(
        "agent/" + url,
        {
          ids: this.thisAgent.id,
          is_serve: value,
          cross_city_service: value
        },
        function(res) {
          if (res.errno === 0) {
            _this.$message({
              showClose: true,
              message: res.errmsg,
              type: "success"
            });
          }
        }
      );
    },

    //更新代理人
    updateUser() {
      if (this.$refs.form2.validate()) {
        this.uuload = true;
        this.$post(
          "agent/changeAgent",
          {
            phone_number: this.formData.phone_number,
            realname: this.formData.realname,
            id: this.thisAgent.id
          },
          function(res) {
            _this.uuload = false;
            if (res.errno === 0) {
              _this.thisAgent.realname = _this.formData.realname;
              _this.thisAgent.phone_number = _this.formData.phone_number;
              _this.$message({
                showClose: true,
                message: res.errmsg,
                type: "success"
              });
            }
          }
        );
      }
    },

    //查询所有信息
    getMsg() {
      this.stload = true;
      this.$post("agent/msg", { id: this.thisAgent.id }, function(res) {
        _this.stload = false;
        if (res.errno === 0) {
          for (let i in res.data.serviceRules) {
            res.data.serviceRules[i].inputVisible = false;
            res.data.serviceRules[i].inputValue = "";
            res.data.serviceRules[i].des_tags = res.data.serviceRules[i]
              .des_tags
              ? res.data.serviceRules[i].des_tags.split(",")
              : [];
          }
          _this.serviceRules = res.data.serviceRules;
          _this.distanceRules = res.data.distanceRules;
          _this.weightRules = res.data.weightRules;
        }
      });
    },
    //去除标签
    handleClose(index, tag) {
      this.serviceRules[index].des_tags.splice(tag, 1);
    },

    //显示输入框
    showInput(index) {
      this.serviceRules[index].inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(index) {
      let inputValue = this.serviceRules[index].inputValue;
      if (inputValue) {
        this.serviceRules[index].des_tags.push(inputValue);
      }
      this.serviceRules[index].inputVisible = false;
      this.serviceRules[index].inputValue = "";
    },

    //删除重量
    delWeight(index) {
      this.$confirm("删除否此数据将无效，可在回收站恢复, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$post(
              "agent/recoverWeight",
              {
                ids: this.weightRules[index].id
              },
              function(res) {
                if (res.errno == 0) {
                  _this.$message({
                    showClose: true,
                    message: res.errmsg,
                    type: "success"
                  });
                  _this.weightRules.splice(index, 1);
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
      
    },
    closeDark() {
      this.$emit("changemsg", true);
    },
    //更新服务
    updateService() {
      this.serveLoad = true;
      this.$post(
        "agent/updateService",
        {
          serviceRules: JSON.stringify(this.serviceRules)
        },
        function(res) {
          _this.serveLoad = false;
          if (res.errno === 0) {
            _this.$message({
              showClose: true,
              message: res.errmsg,
              type: "success"
            });
          }
        }
      );
    },

    //更新路程
    updateDistance() {
      this.serveLoad = true;
      this.$post(
        "agent/updateDistance",
        {
          distanceRules: JSON.stringify(this.distanceRules)
        },
        function(res) {
          _this.serveLoad = false;
          if (res.errno === 0) {
            _this.$message({
              showClose: true,
              message: res.errmsg,
              type: "success"
            });
          }
        }
      );
    },
    //更新重量
    updateWeight() {
      this.serveLoad = true;
      this.$post(
        "agent/updateWeight",
        {
          weightRules: JSON.stringify(this.weightRules)
        },
        function(res) {
          _this.serveLoad = false;
          if (res.errno === 0) {
            _this.$message({
              showClose: true,
              message: res.errmsg,
              type: "success"
            });
          }
        }
      );
    },

    //新增重量
    newWeight() {
      this.addload = true;
      this.$post(
        "agent/newWeight",
        {
          id: this.thisAgent.id
        },
        function(res) {
          _this.addload = false;
          if (res.errno === 0) {
            _this.$message({
              showClose: true,
              message: res.errmsg,
              type: "success"
            });
            _this.weightRulesForm.id = res.data.id;
            _this.weightRulesForm.agent_id = _this.thisAgent.id;
            _this.weightRules.push(
              JSON.parse(JSON.stringify(_this.weightRulesForm))
            );
          }
        }
      );
    }
  }
};
</script>