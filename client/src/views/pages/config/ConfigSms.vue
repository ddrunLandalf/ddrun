<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <v-text-field v-model="formData.accessKeyId" label="用户accessKeyId" ></v-text-field>
      <v-text-field v-model="formData.accessKeySecret" label="用户accessKeySecret" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.signName" label="短信签名名称" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.verifyTpCode" label="短信验证码模板CODE" class="mt-3"></v-text-field>
      <p>模板内容：您的验证码${code}，该验证码10分钟内有效，请勿泄漏于他人！</p>
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
        accessKeyId: "",
        accessKeySecret: "",
        signName:'',
        verifyTpCode:''
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
          config_key: "ali_sms"
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
          config_key: "ali_sms",
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
