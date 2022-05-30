<template>
  <div class="config-content">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <div class="flex flex-between item-center">
        <div class="bold">微信商户号配置</div>
        <a href="https://www.jianshu.com/p/5cc32f592787" target="_blank">帮助</a>
      </div>
      <a-form-model-item ref="wxMchId" label="微信商户ID" prop="wxMchId">
        <a-input
          v-model="formData.wxMchId"
          placeholder="请输入微信商户ID"
          @blur="
            () => {
              $refs.wxMchId.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="wxMchSecert" label="微信商户秘钥" prop="wxMchSecert">
        <a-input
          v-model="formData.wxMchSecert"
          placeholder="请输入商户号秘钥"
          @blur="
            () => {
              $refs.wxMchSecert.onFieldBlur();
            }
          "
        />
      </a-form-model-item>

      <a-form-model-item ref="notifyUrl" label="回调地址" prop="notifyUrl">
        <a-input
          v-model="formData.notifyUrl"
          placeholder="请输入回调地址"
          @blur="
            () => {
              $refs.notifyUrl.onFieldBlur();
            }
          "
        />
        <div class="fo-12 fo-9">输入域名即可，如：https://www.landalf.cn</div>
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
        wxMchId: '',
        wxMchSecert: '',
        notifyUrl: ''
      },
      rules: {
        wxMchId: [{ required: true, message: '输入微信商户ID', trigger: 'blur' }],
        wxMchSecert: [{ required: true, message: '输入微信商户秘钥', trigger: 'blur' }],
        notifyUrl: [{ required: true, message: '输入回调地址', trigger: 'blur' }]
      },
      loading: false
    };
  },
  mounted() {
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminAppMchGet();
      if (result.code === 200) {
        this.formData = result.data;
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminAppMchPost(this.formData);
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
