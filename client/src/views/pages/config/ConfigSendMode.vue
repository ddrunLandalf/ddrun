<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <p>配送模式</p>
      <v-radio-group v-model="formData.mode_type" :mandatory="false" row>
        <v-radio label="抢单模式" :value="1"></v-radio>
        <v-radio label="平均派单" :value="2"></v-radio>
        <v-radio label="就近派单" :value="3"></v-radio>
      </v-radio-group>
      
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
        mode_type: 1,
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
          config_key: "send_mode"
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
          config_key: "send_mode",
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
