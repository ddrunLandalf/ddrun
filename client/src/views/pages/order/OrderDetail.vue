<template>
  <v-dialog v-model="thisValue" persistent max-width="800px">
    <v-card>
      <v-card-title>
        <span class="headline">订单详情</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout wrap justify-space-between>
              <v-flex xs12 md6 sm6 lg6 mb-3>
                  <div><span class="bold">订单编号:</span> {{thisMsg.order_no}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3>
                  <div><span class="bold">订单状态:</span> 
                    {{thisMsg.status == 0 ? '待付款':''}}
                    {{thisMsg.status == 1 ? '已支付':''}}
                    {{thisMsg.status == 2 ? '配送中':''}}
                    {{thisMsg.status == 3 ? '配送完成':''}}
                    {{thisMsg.status == 4 ? '已完成':''}}
                    {{thisMsg.status == -1 ? '交易关闭':''}}
                    {{thisMsg.status == -2 ? '已取消':''}}
                  </div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3>
                  <div><span class="bold">创建时间:</span> {{thisMsg.create_time}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div><span class="bold">服务类型:</span> {{thisMsg.service_type}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">服务城市:</span> {{thisMsg.start_address.city}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">服务路程:</span> {{thisMsg.distance}}米</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">起点地址:</span> {{thisMsg.start_address.formatted_addresse+thisMsg.start_address.street_number+thisMsg.start_address.address_detail}}</div>
                  <div>{{thisMsg.start_address.phone+' ' +thisMsg.name}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">终点地址:</span> {{thisMsg.end_address.formatted_addresse+thisMsg.end_address.street_number+thisMsg.end_address.address_detail}}</div>
                  <div>{{thisMsg.end_address.phone+' ' +thisMsg.name}}</div>
              </v-flex>
              
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">物品描述:</span> {{thisMsg.goods_des}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">支付金额:</span> {{thisMsg.pay_amount}}元</div>
              </v-flex>
              
              <v-flex xs12 md12 sm12 lg12 mb-3 >
                  <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">支付时间:</span> {{thisMsg.status_time1 || '--- --- ---'}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">接单时间:</span> {{thisMsg.status_time2 || '--- --- ---'}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">配送完成:</span> {{thisMsg.status_time3 || '--- --- ---'}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">订单完成:</span> {{thisMsg.status_time4 || '--- --- ---'}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">交易关闭:</span> {{thisMsg.status_time1_ || '--- --- ---'}}</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">取消时间:</span> {{thisMsg.status_time2_ || '--- --- ---'}}</div>
              </v-flex>

              <v-flex xs12 md12 sm12 lg12 mb-3 >
                  <v-divider></v-divider>
              </v-flex>

              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">起步价格:</span> {{thisMsg.start_distance_amount || 0}}元</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">超出路程:</span> {{thisMsg.exceed_distance_amount || 0}}元</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">夜间服务:</span> {{thisMsg.night_price}}元</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">小费金额:</span> {{thisMsg.tip}}元</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">重量价格:</span> {{thisMsg.weight_price}}元</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">优惠价格:</span> -{{thisMsg.discount_amount}}元</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">积分抵扣:</span> -{{thisMsg.interal_amount}}元</div>
              </v-flex>
              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">消耗积分:</span> {{thisMsg.interal_value}}分</div>
              </v-flex>

              <v-flex xs12 md12 sm12 lg12 mb-3 >
                  <v-divider></v-divider>
              </v-flex>

              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">取消理由:</span> {{thisMsg.refund_reason || '无'}}</div>
              </v-flex>

              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">由谁取消:</span> {{thisMsg.ope_type2_ == 1 ? '用户':''}}{{thisMsg.ope_type2_ == 2 ? '跑男':''}}{{thisMsg.ope_type2_ == 3 ? '平台':''}}</div>
              </v-flex>

              <v-flex xs12 md5 sm5 lg5 mb-3 >
                  <div ><span class="bold">由谁完成:</span> {{thisMsg.ope_type4 == 1 ? '用户':''}}{{thisMsg.ope_type4 == 2 ? '跑男':''}}{{thisMsg.ope_type4 == 3 ? '平台':''}}</div>
              </v-flex>


          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <!-- <v-btn color="blue gray" text @click="thisValue = false">取消</v-btn> -->
        <div></div>
        <v-btn color="dark darken-1" @click="thisValue = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
let _this;
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    msg: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      thisValue: this.value,
      thisMsg: JSON.parse(JSON.stringify(this.msg)),
      loading: false,
      roles:[]
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    },
    msg(val) {
      this.thisMsg = val;
    }
  },
  mounted() {
    _this = this;
    _this.getRoleData();
  },
  methods: {
    //获取角色数据
    getRoleData() {
        this.$post('role/list',{
            status:1,
            sorts:'sort asc',
            currentPage:1,
            pageSize:100
        },function(res){
            if(res.errno === 0){
                _this.roles = res.data.data;
            }
        })
    },
    doUpdate() {
      this.loading = true;
      this.$post(
        "admin/updateMsg",
        {
          id: this.thisMsg.id,
          tel_number: this.thisMsg.tel_number,
          realname: this.thisMsg.realname
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
};
</script>