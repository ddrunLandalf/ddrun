<template>
  <v-dialog v-model="thisValue" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar id="core-toolbar" app color="dark" prominent>
        <div class="v-toolbar-title">
          <v-toolbar-title class="white--text font-weight-light">新增优惠券</v-toolbar-title>
        </div>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="thisValue = false">
            <v-icon>el-icon-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <div style="height:60px"></div>
          <v-form ref="form" v-model="valid">
            <v-text-field
              label="优惠券名称"
              :rules="[v => !!v || '优惠券名称']"
              required
              placeholder="输入4-12个字符"
              :counter="12"
              v-model="formData.coupon_name"
            ></v-text-field>
            <v-text-field
              label="过期天数(天)"
              :rules="[v => !!v || '过期天数必填']"
              required
              placeholder="用户领取后生效"
              type="number"
              v-model="formData.deadline_days"
            ></v-text-field>
            <v-text-field
              label="优惠金额(元)"
              :rules="[v => !!v || '优惠金额必填']"
              required
              type="number"
              v-model="formData.discount_amount"
            ></v-text-field>
            <v-text-field
              label="满足最低消费(元)"
              type="number"
              v-model="formData.conditions_amount"
            ></v-text-field>
            <p class="mt-4">服务类型限制</p>
            <v-radio-group v-model="formData.limit_service" :mandatory="false" row>
                <v-radio label="限制服务" :value="1"></v-radio>
                <v-radio label="不限制服务" :value="0"></v-radio>
            </v-radio-group>
           
            <el-checkbox-group v-model="formData.condition_service">
                <el-checkbox label="帮我送" :disabled="formData.limit_service == 0"></el-checkbox>
                <el-checkbox label="帮我取" :disabled="formData.limit_service == 0"></el-checkbox>
                <el-checkbox label="帮我买" :disabled="formData.limit_service == 0"></el-checkbox>
                <el-checkbox label="代驾" :disabled="formData.limit_service == 0"></el-checkbox>
            </el-checkbox-group>
            
            <v-text-field
              label="发放数量限制(填-1表示不限制)"
              type="number"
              class="mt-4"
              v-model="formData.limit_no"
            ></v-text-field>

            <p class="mt-4">优惠券状态</p>
            <v-radio-group v-model="formData.status" :mandatory="false" row>
                <v-radio label="开启优惠券" :value="1"></v-radio>
                <v-radio label="不可领取" :value="2"></v-radio>
                <v-radio label="停用优惠券" :value="3"></v-radio>
            </v-radio-group>
           
            <v-btn color="dark" :loading="loading" @click="doEdit()">确认添加</v-btn>
          </v-form>
        </v-container>
      </v-card-text>
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
    }
  },
  data() {
    return {
      thisValue: this.value,
      loading: false,
      roles: [],
      valid:true,
      formData: {
        coupon_name: "",
        deadline_days: "",
        discount_amount: "",
        conditions_amount: 0,
        condition_service: [],
        status:1,
        limit_no:"",
        limit_service:0
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
            this.loading = true;
            let form = JSON.parse(JSON.stringify(this.formData));
            form.condition_service = form.condition_service.toString();
          this.$post("coupon/add", form, function(res) {
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
          });
        
      }
    }
  }
};
</script>