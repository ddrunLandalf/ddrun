<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <v-text-field v-model="formData.old_pwd" label="原密码"></v-text-field>
      <v-text-field v-model="formData.new_pwd" label="新密码" class="mt-3"></v-text-field>
      <v-text-field v-model="formData.com_pwd" label="确认密码" class="mt-3"></v-text-field>
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
      formData: {
        old_pwd: "",
        new_pwd: "",
        com_pwd: ""
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
      }
    }
  },

  mounted() {
    _this = this;
  },
  methods: {
    submit() {
      if (this.formData.old_pwd == "") {
        _this.$message({
          showClose: true,
          message: "原密码必填",
          type: "error"
        });
      } else if (this.formData.new_pwd == "") {
        _this.$message({
          showClose: true,
          message: "新密码必填",
          type: "error"
        });
      }else if(this.formData.new_pwd != this.formData.com_pwd){
          _this.$message({
            showClose: true,
            message: "密码不一致",
            type: "error"
            });
      }else{
          this.tload = true;
          this.$post(
            "admin/updatePwd",
            {
              old_pwd: this.formData.old_pwd,
              new_pwd: this.formData.new_pwd
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
};
</script>
