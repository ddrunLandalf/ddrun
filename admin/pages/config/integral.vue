<template>
  <div class="home-container">
    <a-page-header title="积分设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="积分抵扣比例">
          <a-input-number
            v-model="formData.withIntegral"
            placeholder="请输入积分抵扣比例"
            style="width: 100%"
          ></a-input-number>
          <div class="fo-12 fo-9">
            输入1000 则表示1000积分可抵扣1元，输入100表示100积分可抵扣1元
          </div>
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
import EditMixin from '@/plugins/mixins/edit-mixin.vue';
export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        withIntegral: 1000
      },
      autoBack: false
    };
  },
  computed: {
    method() {
      return 'adminIntegralPost';
    }
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminIntegralGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    }
  }
});
</script>
