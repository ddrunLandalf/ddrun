<template>
  <div class="login-bg">
    <div class="login-container">
      <v-layout justify-center align-center>
        <v-flex xs12 md4 lg4 sm8>
          <div class="white login-pa">
            <div>
              <span class="headline">管理员请先登录</span>
            </div>
            <v-form ref="form" v-model="valid" :lazy-validation="false">
              <div class="mt-4">
                <v-text-field
                  v-model="admin_name"
                  label="管理员用户名"
                  :rules="[v => !!v || '请输入管理员用户名']"
                  placeholder="请输入管理员用户名"
                  required
                ></v-text-field>
              </div>
              <div class="mt-2">
                <v-text-field
                  v-model="admin_pwd"
                  label="密码"
                  :rules="[v => !!v || '请输入密码']"
                  placeholder="请输入密码"
                  type="password"
                  required
                ></v-text-field>
              </div>
              <!-- <div class="mt-2">
                <v-text-field
                  label="验证码"
                  :rules="[v => !!v || '请输入验证码']"
                  suffix="5648"
                ></v-text-field>
              </div> -->
              <v-btn
                block
                color="green"
                class="mt-4"
                :loading="loading"
                large
                dark
                @click="login()"
              >登 录</v-btn>
            </v-form>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
let _this;
export default {
  data() {
    return {
      valid: true,
      admin_name: "",
      admin_pwd: "",
      code:'',
      loading: false
    };
  },
  mounted(){
    _this = this;
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$post('admin/login',{
          admin_name: this.admin_name,
          admin_pwd: this.admin_pwd
        },function (res) {
          _this.loading = false;
          if(res.errno === 0){
            sessionStorage.setItem('admin_name',res.data.userInfo.admin_name);
            sessionStorage.setItem('admin_pwd',_this.admin_pwd);
            sessionStorage.setItem('uid',res.data.userInfo.id);
            sessionStorage.setItem('token',res.data.token);
            _this.$message({
                showClose: true,
                message: res.errmsg,
                type: 'success'
              });
            _this.$router.push({path:'/dashboard'})
          }
        })
      }
    }
  }
};
</script>