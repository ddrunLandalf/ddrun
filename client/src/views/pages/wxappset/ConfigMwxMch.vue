<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <v-text-field v-model="formData.mchid" label="商户号Mchid"></v-text-field>
      <v-text-field v-model="formData.mch_secert" label="商户密钥key" class="mt-3"></v-text-field>
      <el-upload
        class="upload-demo"
        :action="api+'file/cert'"
        :headers="headers"
        :with-credentials="true"
        :on-success="uploadSuccess"
      >
        <el-button size="small" type="primary">点击上传p12证书文件 {{formData.apiclient_cert ? '已上传':''}}
        </el-button>
        <div slot="tip" class="el-upload__tip">必须上传p12文件 {{formData.apiclient_key ? '已上传':''}}</div>
      </el-upload>
      <el-upload
        class="upload-demo mt-4"
        :action="api+'file/cert'"
        :headers="headers"
        :with-credentials="true"
        :on-success="uploadSuccess2"
      >
        <el-button size="small" type="primary">点击上传证书密钥</el-button>
        <div slot="tip" class="el-upload__tip">只能上传pem文件</div>
      </el-upload>
      <v-btn class="mt-3 dark" :loading="tload" @click="submit()">保存</v-btn>
    </v-form>
  </v-container>
</template>

<script>
let _this;
export default {
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      api: this.$api,
      formData: {
        mchid: "",
        mch_secert: "",
        apiclient_cert: "",
        apiclient_key: ""
      },
      pageLoad: this.load,
      tload: false,
      headers: {
        token: sessionStorage.getItem("token")
      }
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
          config_key: "mwx_mch"
        },
        function(res) {
          _this.tload = false;
          if (res.errno == 0) {
            if (res.data.config_content) {
              _this.formData = JSON.parse(res.data.config_content);
            }
          }
        }
      );
    },
    //上传文件成功
    uploadSuccess(e) {
      if (e.errno == 0) {
        this.formData.apiclient_cert = e.data.url;
      }
    },
    //上传文件成功
    uploadSuccess2(e) {
      if (e.errno == 0) {
        this.formData.apiclient_key = e.data.url;
      }
    },
    submit() {
      this.tload = true;
      this.$post(
        "config/update",
        {
          config_key: "mwx_mch",
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
};
</script>
