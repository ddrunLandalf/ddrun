<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:100%;margin:auto">
      <vue-editor v-model="formData"></vue-editor>
      <v-btn class="mt-3 dark" :loading="tload" @click="submit()">保存</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
let _this ;
export default {
  components: {
    VueEditor
  },
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: "",
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
          config_key: "run_pointer"
        },
        function(res) {
          _this.tload = false;
          if (res.errno == 0) {
            if (res.data.config_content) {
                _this.formData = res.data.config_content;
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
          config_key: "run_pointer",
          config_content: this.formData
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
