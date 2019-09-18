<template>
  <v-dialog v-model="thisValue" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar id="core-toolbar" app color="dark" prominent>
        <div class="v-toolbar-title">
          <v-toolbar-title class="white--text font-weight-light">新增城市代理</v-toolbar-title>
        </div>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="thisValue = false,sloading = false">
            <v-icon>el-icon-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <div style="height:60px"></div>
          <v-form ref="form" v-model="valid">
            <p>代理城市:</p>
            <el-select v-model="formData.city_name" filterable placeholder="请选择一个城市">
              <el-option-group v-for="group in cityData" :key="group.name" :label="group.name">
                <el-option
                  v-for="item in group.cities"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-option-group>
            </el-select>
            <v-text-field
              class="mt-4"
              label="代理人姓名"
              :rules="[v => !!v || '代理人姓名必填']"
              required
              placeholder="输入代理人姓名"
              v-model="formData.realname"
            ></v-text-field>
            <v-text-field
              label="代理人手机号(必须在小程序注册过用户才有效)"
              :rules="[v => !!v || '代理人手机号必填']"
              required
              placeholder="输入11个字符"
              :counter="11"
              v-model="formData.phone_number"
            ></v-text-field>
            <p>跨城服务</p>
            <v-radio-group v-model="formData.cross_city_service" :mandatory="false" row>
              <v-radio label="开启" :value="1"></v-radio>
              <v-radio label="关闭" :value="0"></v-radio>
            </v-radio-group>
            <p>代理服务</p>
            <v-radio-group v-model="formData.is_serve" :mandatory="false" row>
              <v-radio label="开启" :value="1"></v-radio>
              <v-radio label="关闭" :value="0"></v-radio>
            </v-radio-group>

            <v-toolbar id="core-toolbar" color="bg-default" prominent>
              <div class="v-toolbar-title">
                <v-toolbar-title
                  class="tertiary--text font-weight-light"
                >设置服务收益及状态: (以下每项都必填，若不填可能会造成功能无法使用)</v-toolbar-title>
              </div>
            </v-toolbar>
            <!-- <p class="red--text">
              示例：起步路程3000米，起步价7元，超出路程1000米，超出路程加价1.5元，最大服务路程20000米。
              <br />表示：3km内支付7元，超出3km每1km加价1.5元，不能超过最大服务路程。
              <br />如：用户的服务路程为16km，那么需支付: 7+(16-3)*1.5 = 26.5元 ；的路程费。
            </p> -->
            <el-table
              :data="serviceRules"
              border
              style="width: 100%"
              type="expand"
              default-expand-all >
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
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.$index)">+ 添加标签</el-button>
                  </div>
                  <div v-if="scope.row.service_type == '代驾'">无需添加内容</div>
                  <div v-if="scope.row.service_type == '帮我买'" class="mt-4">
                    <el-input placeholder="就近多少公里内购买" v-model="scope.row.buy_meter"></el-input>
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
                <v-toolbar-title
                  class="tertiary--text font-weight-light"
                >填写重量计价规则: (至少增加一项)</v-toolbar-title>
              </div>
            </v-toolbar>
            <p class="red--text">
             提示：所有的最大重量和最小重量不能出现重复数字，而且最大重量必须大于最小重量。
            </p>
            <el-table :data="weightRules" border style="width: 100%">
              <el-table-column label="最小重量">
                <template slot-scope="scope">
                  <div>
                    <el-input
                      v-model="scope.row.min_weight"
                      type="number"
                      placeholder="最小重量"
                    />
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
                    <el-input
                      v-model="scope.row.price"
                      type="number"
                      placeholder="价格"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="规则">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.min_weight+'~'+scope.row.max_weight+'g 之间为'+scope.row.price+'元'}}
                  </div>
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
            <el-button class="button-new-tag" size="small" @click="weightRules.push(JSON.parse(JSON.stringify(weightRulesForm)))">+ 添加一项重量规则</el-button>
            <br>
            <v-btn color="dark" :loading="sloading" @click="doEdit()">保存提交</v-btn>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import cityData from ".././../../utils/city.js";
let _this;
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      thisValue: this.value,
      sloading: false,
      roles: [],
      valid: true,
      cityData: cityData,
      formData: {
        city_name: "",
        is_serve: 1,
        realname: "",
        phone_number: "",
        cross_city_service: 0
      },
      distanceRules: [
        {
          start_distance: "",
          start_price: "",
          exceed_everyone_distance: "",
          exceed_everyone_price: "",
          max_distance: "",
          rule_type: "帮我送"
        },
        {
          start_distance: "",
          start_price: "",
          exceed_everyone_distance: "",
          exceed_everyone_price: "",
          max_distance: "",
          rule_type: "帮我取"
        },
        {
          start_distance: "",
          start_price: "",
          exceed_everyone_distance: "",
          exceed_everyone_price: "",
          max_distance: "",
          rule_type: "帮我买"
        },
        {
          start_distance: "",
          start_price: "",
          exceed_everyone_distance: "",
          exceed_everyone_price: "",
          max_distance: "",
          rule_type: "代驾"
        }
      ],
      serviceRules: [
        {
          inputVisible:false,
          inputValue: "",
          open_service: 1,
          buy_meter: "",
          init_time: "",
          platform_profit: "",
          agent_profit: "",
          user_profit: "",
          des_tags: [],
          service_type: "帮我送"
        },
        {
          inputValue:"",
          inputVisible:false,
          open_service: 1,
          buy_meter: "",
          init_time: "",
          platform_profit: "",
          agent_profit: "",
          user_profit: "",
          des_tags: [],
          service_type: "帮我取"
        },
        {
          inputValue:"",
          inputVisible:false,
          open_service: 1,
          buy_meter: "",
          init_time: "",
          platform_profit: "",
          agent_profit: "",
          user_profit: "",
          des_tags: [],
          service_type: "帮我买"
        },
        {
          inputValue:"",
          inputVisible:false,
          open_service: 1,
          buy_meter: "",
          init_time: "",
          platform_profit: "",
          agent_profit: "",
          user_profit: "",
          des_tags: [],
          service_type: "代驾"
        }
      ],
      weightRules: [],
      weightRulesForm:{
        min_weight:'',
        max_weight:'',
        price:'',
      }
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    }
  },
  mounted() {
    _this = this;
  },
  methods: {
    
    doEdit() {
      if (this.$refs.form.validate()) {
          this.sloading = true;
          this.$post("agent/add", {
            formData: JSON.stringify(this.formData),
            distanceRules: JSON.stringify(this.distanceRules),
            serviceRules: JSON.stringify(this.serviceRules),
            weightRules:JSON.stringify( this.weightRules)
          }, function(res) {
            _this.sloading = false;
            if (res.errno == 0) {
              _this.$message({
                showClose: true,
                message: res.errmsg,
                type: "success"
              });
              _this.thisValue = false;
              _this.sloading = false;
              _this.$emit("changemsg", res);
            }
          });
        
      }
    },

    //去除标签
    handleClose(index, tag) {
      this.serviceRules[index].des_tags.splice(
        tag,
        1
      );
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
    delWeight(index){
      this.weightRules.splice(index,1)
    }
  }
};
</script>