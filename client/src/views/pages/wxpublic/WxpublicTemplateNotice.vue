<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
          <div>模板编号：{{formData.newOrderNotice.temp_no}}</div>
          <div>标题：{{formData.newOrderNotice.title}}</div>
          <div>行业：{{formData.newOrderNotice.industry}}</div>
          <v-text-field v-model="formData.newOrderNotice.templateId" label="模板ID" class="mt-3"></v-text-field>
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
        newOrderNotice: {
            temp_no:'OPENTM414349804',
            title:'新订单提醒',
            industry:'IT科技 - 互联网|电子商务',
            templateId:''
        },
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
          config_key: "wxp_template"
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
          config_key: "wxp_template",
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
