<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <v-text-field v-model="formData.navbarTitle" label="小程序标题栏标题" ></v-text-field>
      <div class="panel-start item-center mt-3">
        <div>
          <div>标题栏前景色:</div>
          <el-color-picker v-model="formData.navbarFrontColor"></el-color-picker>
        </div>
        <div class="ml-4">
          <div>标题栏背景色:</div>
          <el-color-picker v-model="formData.navbarBackColor"></el-color-picker>
        </div>
      </div>
      <v-text-field v-model="formData.shareTitle" label="分享标题" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.sharePath" label="分享路径(禁止带参数)" class="mt-3"></v-text-field>
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
        navbarTitle: "",
        navbarFrontColor: "#000000",
        navbarBackColor: "#ffffff",
        shareTitle: "",
        sharePath: ""
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
    _this.getConfig();
  },
  methods: {
    //获取配置
    getConfig() {
      _this.tload = true;
      this.$post(
        "config/get",
        {
          config_key: "mwx_page_setting"
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
          config_key: "mwx_page_setting",
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
