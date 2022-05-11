<template>
  <div class="home-container">
    <a-page-header title="提现设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="是否开启此项功能">
          <a-radio-group v-model="formData.newUserOpen">
            <a-radio :value="true"> 开启 </a-radio>
            <a-radio :value="false"> 关闭 </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="是否开启此项功能">
          <a-radio-group v-model="formData.shareOpen">
            <a-radio :value="true"> 开启 </a-radio>
            <a-radio :value="false"> 关闭 </a-radio>
          </a-radio-group>
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
interface GetRulesProbability {
  couponNo: string;
  // 概率
  probability: number;
}
export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        newUserOpen: false,
        newUserRules: [] as GetRulesProbability[],

        shareOpen: false,
        shareUserRules: [] as GetRulesProbability[]
      },
      coupons: [],
      autoBack: false
    };
  },
  computed: {
    method(): string {
      return 'adminCouponPost';
    }
  },
  mounted() {
    this.getConfig();
    this.getCoupons();
  },
  methods: {
    async getConfig() {
      const result = await (this as any).$api.adminCouponGet();
      if (result.code === 200) {
        this.formData = result.data;
      }
    },
    del(index: number, type: 'newUserRules' | 'shareUserRules') {
      this.formData[type].splice(index, 1);
    },
    async getCoupons() {
      const result = await (this as any).$api.couponList({
        pageSize: 1000,
        status: 1
      });
      if (result.code === 200) {
        this.coupons = result.data.data;
      }
    }
  }
});
</script>
