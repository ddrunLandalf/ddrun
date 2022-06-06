<template>
  <div class="config-content">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <div class="flex flex-between item-center">
        <div class="bold">微信小程序配置</div>
        <a href="https://www.jianshu.com/p/5cc32f592787" target="_blank">帮助</a>
      </div>
      <a-form-model-item ref="wxAppId" label="小程序ID" prop="wxAppId">
        <a-input
          v-model="formData.wxAppId"
          placeholder="请输入小程序ID"
          @blur="
            () => {
              $refs.wxAppId.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="wxAppSecret" label="小程序秘钥" prop="wxAppSecret">
        <a-input
          v-model="formData.wxAppSecret"
          placeholder="请输入小程序秘钥"
          @blur="
            () => {
              $refs.wxAppSecret.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-divider></a-divider>
      <div class="flex flex-between item-center">
        <div class="bold">QQ小程序配置</div>
        <a href="https://www.jianshu.com/p/5cc32f592787" target="_blank">帮助</a>
      </div>
      <a-form-model-item label="小程序ID">
        <a-input v-model="formData.qqAppid" placeholder="请输入qq小程序ID" />
      </a-form-model-item>

      <a-form-model-item label="小程序秘钥">
        <a-input v-model="formData.qqAppSecret" placeholder="请输入小程序秘钥" />
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" size="large" :loading="loading" @click="submit">提交保存</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      formData: {
        wxAppId: '',
        wxAppSecret: '',
        qqAppid: '',
        qqAppSecret: ''
      },
      rules: {
        wxAppId: [{ required: true, message: '输入小程序ID', trigger: 'blur' }],
        wxAppSecret: [{ required: true, message: '输入小程序秘钥', trigger: 'blur' }]
      },
      loading: false
    };
  },
  mounted() {
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminAppauthGet();
      if (result.code === 200) {
        this.formData = Object.assign(this.formData, result.data);
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminAppauthPost(this.formData);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
          }
        } else {
          return false;
        }
      });
    }
  }
});
</script>
<style lang="less" scoped>
.config-content {
  width: 500px;
  margin: auto;
  padding-top: 80px;
}
</style>
