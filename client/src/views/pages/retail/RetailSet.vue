<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <p>分销状态</p>
      <v-radio-group v-model="formData.status" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>
      <p>分销类型</p>
      <v-radio-group v-model="formData.type" :mandatory="false" row>
        <v-radio label="人人分销" :value="1"></v-radio>
        <v-radio label="指定人员分销" :value="2"></v-radio>
      </v-radio-group>
      <v-text-field v-model="formData.frate" label="一级提成" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.srate" label="二级提成" class="mt-3"></v-text-field>
      <p>提成为：每一笔订单占平台收益的百分比</p>
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
        status: "",
        type: "",
        frate:"",
        srate:""
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
          config_key: "retail"
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
          config_key: "retail",
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
