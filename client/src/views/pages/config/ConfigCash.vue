<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <p>提现设置</p>
      <v-radio-group v-model="formData.cash_type" :mandatory="false" row>
        <v-radio label="人工审核提现到银行卡" :value="1"></v-radio>
        <v-radio label="自动提现到零钱" :value="2"></v-radio>
        <v-radio label="人工审核提现到零钱" :value="3"></v-radio>
      </v-radio-group>
      <p>提现次数</p>
      <v-radio-group v-model="formData.cash_time" :mandatory="false" row>
        <v-radio label="每天" :value="1"></v-radio>
        <v-radio label="每周" :value="2"></v-radio>
        <v-radio label="每月" :value="3"></v-radio>
      </v-radio-group>
      <v-text-field v-model="formData.cash_number" label="填写提现次数" ></v-text-field>
      <v-text-field v-model="formData.run_min_cash" label="跑男一次最少提现金额" ></v-text-field>
      <v-text-field v-model="formData.run_max_cash" label="跑男一次最多提现金额" ></v-text-field>
      <v-text-field v-model="formData.user_min_cash" label="用户一次最少提现金额" ></v-text-field>
      <v-text-field v-model="formData.user_max_cash" label="用户一次最多提现金额" ></v-text-field>
      <v-text-field v-model="formData.agent_min_cash" label="代理一次最少提现金额" ></v-text-field>
      <v-text-field v-model="formData.agent_max_cash" label="代理一次最多提现金额" ></v-text-field>
      <v-btn class="mt-3 dark" :loading="tload" @click="submit()">保存</v-btn>
    </v-form>
  </v-container>
</template>

<script>
let _this ;
export default {
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        cash_type: "",
        cash_time: "",
        cash_number:"",
        run_min_cash:"",
        run_max_cash:"",
        user_min_cash:"",
        user_max_cash:"",
        agent_min_cash:"",
        agent_max_cash:""
      },
      pageLoad: this.load,
      tload: false
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
        this.getConfig();
      }
    }
  },
  
  mounted() {
    _this = this;
    // _this.getConfig();
  },
  methods: {
    //获取配置
    getConfig() {
      _this.tload = true;
      this.$post(
        "config/get",
        {
          config_key: "cash"
        },
        function(res) {
          _this.tload = false;
          if (res.errno == 0) {
            if (res.data.config_content) {
                _this.formData = JSON.parse(res.data.config_content);
            }
          }
        }
      )
    },
    submit() {
      this.tload = true;
      this.$post(
        "config/update",
        {
          config_key: "cash",
          config_content: JSON.stringify(this.formData)
        },
        function(res) {
          _this.tload = false;
          if (res.errno === 0) {
            _this.$message({
              showClose: true,
              message: res.errmsg,
              type: "success"
            });
          }
        }
      );
    }
  }
}
</script>
