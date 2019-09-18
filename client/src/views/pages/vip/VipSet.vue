<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <el-upload
        class="upload-demo"
        :action="api+'file/img'"
        :headers="headers"
        :with-credentials="true"
        :on-success="uploadSuccess"
      >
        <el-button size="small" type="primary">点击上传会员卡封面</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1mb</div>
      </el-upload>
      <div class="img" v-if="formData.cover" :style="'background-image:url('+api+formData.cover+')'"></div>
      <v-text-field v-model="formData.monthPrice" label="月卡价格(元)" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.seasonPrice" label="季卡价格(元)" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.yearPrie" label="年卡价格(元)" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.dayCoupons" label="每日可领的优惠券,填写优惠券ID，可填多个ID用英文“,”隔开" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.weekCoupons" label="每周可领的优惠券,填写优惠券ID，可填多个ID用英文“,”隔开" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.monthCoupons" label="每月可领的优惠券,填写优惠券ID，可填多个ID用英文“,”隔开" class="mt-3"></v-text-field>
      <p>是否开启双倍积分</p>
      <v-radio-group v-model="formData.cross_city_service" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>
      <v-textarea
          label="会员说明"
          v-model="formData.vip_text"
        ></v-textarea>
      <v-btn class="mt-3 dark" :loading="tload" @click="submit()">保存</v-btn>
    </v-form>
  </v-container>
</template>
<style>
    .img{
        width:200px;
        height:120px;
        border-radius: 2px;
        background-size: cover;
        background-position: center;
    }
</style>
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
      formData: {
        cover: "",
        monthPrice: "",
        seasonPrice: "",
        yearPrie: "",
        dayCoupons:"",
        weekCoupons:"",
        monthCoupons:"",
        open_double: "",
        vip_text:""
      },
      headers: {
        token: sessionStorage.getItem("token")
      },
      api:this.$api,
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
          config_key: "vip_set"
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
        this.formData.cover = e.data.url;
      }
    },
    submit() {
      this.tload = true;
      this.$post(
        "config/update",
        {
          config_key: "vip_set",
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
