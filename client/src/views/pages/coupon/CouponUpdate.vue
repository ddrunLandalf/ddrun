<template>
  <v-dialog v-model="thisValue" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">修改信息</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field
              label="发放数量限制(填-1表示不限制)"
              type="number"
              class="mt-4"
              v-model="thisMsg.limit_no"
            ></v-text-field>

            <p class="mt-4">优惠券状态</p>
            <v-radio-group v-model="thisMsg.status" :mandatory="false" row>
                <v-radio label="开启优惠券" :value="1"></v-radio>
                <v-radio label="不可领取" :value="2"></v-radio>
                <v-radio label="停用优惠券" :value="3"></v-radio>
            </v-radio-group>
          
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn color="blue gray" text @click="thisValue = false">取消</v-btn>
        <v-btn color="dark darken-1" :loading="loading" text @click="doUpdate()">保存</v-btn>
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
      default: {
        status: "",
        limit_no: ""
      }
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
      this.thisMsg = JSON.parse(JSON.stringify(val));
    }
  },
  mounted() {
    _this = this;
  },
  methods: {
    
    doUpdate() {
      this.loading = true;
      this.$post(
        "coupon/update",
        {
          id: this.thisMsg.id,
          status: this.thisMsg.status,
          limit_no: this.thisMsg.limit_no
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