<template>
  <div class="home-container">
    <div class="home-page-title">小费配置</div>
    <div class="edit-content mt-20">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="小程序端展示的小费选项">
          <a-row v-for="(item, index) in formData.feeTips" :key="index" class="mb-8" :gutter="16">
            <a-col :span="22">
              <a-input-number
                v-model="formData.feeTips[index]"
                style="width: 100%"
              ></a-input-number>
            </a-col>
            <a-col :span="2">
              <a-button
                type="danger"
                shape="circle"
                icon="delete"
                @click="formData.feeTips.splice(index, 1)"
              />
            </a-col>
          </a-row>
          <a-button class="mt-12" size="large" @click="formData.feeTips.push(0)"
            >+ 添加一项</a-button
          >
        </a-form-model-item>
        <a-form-model-item label="平台抽成">
          <a-input-number v-model="formData.platformExtract" style="width: 100%"></a-input-number>
        </a-form-model-item>
        <a-form-model-item label="代理抽成">
          <a-input-number v-model="formData.agentExtract" style="width: 100%"></a-input-number>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" size="large" :loading="loading" @click="submit"
            >提交保存</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        feeTips: [] as number[],
        platformExtract: 0,
        agentExtract: 0
      },
      rules: {},
      loading: false
    };
  },
  mounted() {
    this.getauth();
  },
  methods: {
    async getauth() {
      const result = await (this as any).$api.adminOrderFeeGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminOrderFeePost(this.formData);
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
