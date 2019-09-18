<template>
  <v-dialog v-model="thisValue" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">群发优惠券</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <el-select v-model="couponFlag" placeholder="请选择优惠券">
            <el-option
              v-for="(item,index) in coupons"
              :key="item.id"
              :label="item.coupon_name+' '+ item.discount_amount+'元'"
              :value="index"
            ></el-option>
          </el-select>
          <p class="mt-3" v-if="couponFlag != ''">数量限制：{{coupons[couponFlag].limit_no == -1? '不限制':'剩余可发'+(coupons[couponFlag].limit_no-coupons[couponFlag].cumulative_draw_no)+'张'}}</p>
          <p class="mt-3">您选择了“{{thisIds.split(',').length}}”个用户</p>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn color="blue gray" text @click="thisValue = false">取消</v-btn>
        <v-btn color="dark darken-1" :loading="loading" text @click="doUpdate()">立即发放</v-btn>
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
    ids: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      thisValue: this.value,
      thisIds: this.ids,
      loading: false,
      couponFlag:'',
      coupons: []
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    },
    ids(val) {
      this.thisIds = val;
    }
  },
  mounted() {
    _this = this;
    _this.getCouponList();
  },
  methods: {
    getCouponList() {
      this.$post(
        "coupon/list",
        { pageSize: 200, currentPage: 1, status: 1,limit_service:'' },
        function(res) {
          if (res.errno === 0) {
            _this.coupons = res.data.data;
          }
        }
      );
    },

    doUpdate() {
      this.loading = true;
      this.$post(
        "coupon/send",
        {
          coupon_id: this.coupons[this.couponFlag].id,
          ids: this.thisIds,
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