<template>
  <v-dialog v-model="thisValue" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar id="core-toolbar" app color="dark" prominent>
        <div class="v-toolbar-title">
          <v-toolbar-title class="white--text font-weight-light">新增管理员</v-toolbar-title>
        </div>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="thisValue = false">
            <v-icon>el-icon-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <div style="height:60px"></div>
          <v-form ref="form" v-model="valid">
            <v-text-field
              label="登录账号"
              :rules="[v => !!v || '登录账号必填']"
              required
              placeholder="输入4-12个字符"
              :counter="12"
              v-model="formData.admin_name"
            ></v-text-field>
            <v-text-field
              label="登录密码"
              :rules="[v => !!v || '登录密码必填']"
              required
              placeholder="输入6-14个字符"
              :counter="14"
              type="password"
              v-model="formData.admin_pwd"
            ></v-text-field>
            <v-text-field
              label="确认密码"
              :rules="[v => !!v || '确认密码必填']"
              required
              :counter="14"
              type="password"
              v-model="formData.admin_pwd2"
            ></v-text-field>

            <v-select
              v-model="formData.role_id"
              :items="roles"
              :rules="[v => !!v || '请选择一个角色']"
              required
              label="选择一个角色*"
              item-text="role_name"
              item-value="id"
            ></v-select>
            <v-divider />
            <v-text-field label="姓名" v-model="formData.realname"></v-text-field>
            <v-text-field label="手机号" v-model="formData.tel_number"></v-text-field>
            <v-btn color="dark" :loading="loading" @click="doEdit()">确认添加</v-btn>
          </v-form>
        </v-container>
      </v-card-text>
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
    }
  },
  data() {
    return {
      thisValue: this.value,
      loading: false,
      roles: [],
      valid:true,
      formData: {
        admin_name: "",
        admin_pwd: "",
        admin_pwd2: "",
        role_id: "",
        tel_number: "",
        realname: ""
      }
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    }
  },
  mounted() {
    _this = this;
    _this.getRoleData();
  },
  methods: {
    //获取角色数据
    getRoleData() {
      this.$post(
        "role/list",
        {
          status: 1,
          sorts: "sort asc",
          currentPage: 1,
          pageSize: 100
        },
        function(res) {
          if (res.errno === 0) {
            _this.roles = res.data.data;
          }
        }
      );
    },
    doEdit() {
      if (this.$refs.form.validate()) {
        if (this.formData.admin_pwd == this.formData.admin_pwd2) {
          this.loading = true;
          this.$post("admin/add", this.formData, function(res) {
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
          });
        } else {
          _this.$message({
            showClose: true,
            message: "密码不一致",
            type: "error"
          });
        }
      }
    }
  }
};
</script>