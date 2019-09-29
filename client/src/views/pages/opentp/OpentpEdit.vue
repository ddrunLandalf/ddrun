<template>
  <v-dialog v-model="thisValue" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{resType === 'add' ? '添加应用':'修改应用'}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-text-field
              label="应用名称*"
              placeholder="输入应用名称"
              :rules="[v => !!v || '应用名称必填']"
              required
              v-model="thisMsg.app_name"
            ></v-text-field>
            <v-text-field label="ip白名单列表" placeholder="输入多个ip，请用“,”隔开。所有ip均可访问，请输入“*”" v-model="thisMsg.ip_white_list"></v-text-field>
            <v-text-field label="回调地址" placeholder="输入回调地址，用于发送通知" v-model="thisMsg.cb_url"></v-text-field>
            <div>
              <span>是否启用：</span>
              <el-switch
                v-model="thisMsg.status"
                active-color="#13ce66"
                inactive-color="#e1e1e1"
                :inactive-value="0"
                :active-value="1"
              ></el-switch>
            </div>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn color="blue gray" text @click="thisValue = false">取消</v-btn>
        <v-btn color="dark darken-1" :loading="loading" text @click="doUpdate()">保存</v-btn>
      </v-card-actions>
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
    },
    msg: {
      type: Object,
      required: false,
      default: {
        app_name: "",
        ip_white_list: "",
        status: 1,
        cb_url:""
      }
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      valid: true,
      resType: this.type,
      thisValue: this.value,
      thisMsg: JSON.parse(JSON.stringify(this.msg)),
      loading: false
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    },
    type(val){
      this.resType = val;
      if(val === 'add'){
          this.thisMsg = {
              app_name: "",
              ip_white_list: "",
              status: 1,
              cb_url:""
          }
      }
    },
    msg(val) {
      this.thisMsg = val;
    }
  },
  mounted() {
    _this = this;
  },
  methods: {
    doUpdate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$post(
          "admin/opentp/" + this.resType,
          {
            id: this.thisMsg.id || "",
            app_name: this.thisMsg.app_name,
            ip_white_list: this.thisMsg.ip_white_list,
            status: this.thisMsg.status,
            cb_url: this.thisMsg.cb_url
          },
          function(res) {
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
          }
        );
      }
    }
  }
};
</script>