<template>
  <div class="home-container">
    <a-page-header title="优惠券设置"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-divider>新用户获得优惠券</a-divider>
        <a-form-model-item label="是否开启此项功能">
          <a-radio-group v-model="formData.newUserOpen">
            <a-radio :value="true"> 开启 </a-radio>
            <a-radio :value="false"> 关闭 </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="获得优惠券规则">
          <a-row
            v-for="(item, index) in formData.newUserRules"
            :key="index"
            :gutter="20"
            class="mb-12"
          >
            <a-col :span="10">
              <div>选择一张优惠券</div>
              <a-select
                v-model="item.couponNo"
                show-search
                style="width: 100%"
                placeholder="请选择"
              >
                <a-select-option
                  v-for="(item1, index1) in coupons"
                  :key="index1"
                  :value="item1.couponNo"
                >
                  {{ item1.couponName }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="10">
              <div>概率(填100表示100%获得)</div>
              <a-input-number v-model="item.probability" style="width: 100%" />
            </a-col>
            <a-col :span="4">
              <a-button
                style="margin-top: 44px"
                type="danger"
                shape="circle"
                icon="delete"
                @click="del(index, 'newUserRules')"
              />
            </a-col>
          </a-row>
          <a-button
            size="large"
            @click="formData.newUserRules.push({ couponNo: '', probability: 0 })"
            >+ 添加一项规则</a-button
          >
        </a-form-model-item>

        <a-divider>转发获得优惠券</a-divider>
        <a-form-model-item label="是否开启此项功能">
          <a-radio-group v-model="formData.shareOpen">
            <a-radio :value="true"> 开启 </a-radio>
            <a-radio :value="false"> 关闭 </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="获得优惠券规则">
          <a-row
            v-for="(item, index) in formData.shareUserRules"
            :key="index"
            :gutter="20"
            class="mb-12"
          >
            <a-col :span="10">
              <div>选择一张优惠券</div>
              <a-select
                v-model="item.couponNo"
                show-search
                style="width: 100%"
                placeholder="请选择"
              >
                <a-select-option
                  v-for="(item1, index1) in coupons"
                  :key="index1"
                  :value="item1.couponNo"
                >
                  {{ item1.couponName }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="10">
              <div>概率(填100表示100%获得)</div>
              <a-input-number v-model="item.probability" style="width: 100%" />
            </a-col>
            <a-col :span="4">
              <a-button
                style="margin-top: 44px"
                type="danger"
                shape="circle"
                icon="delete"
                @click="del(index, 'shareUserRules')"
              />
            </a-col>
          </a-row>
          <a-button
            size="large"
            @click="formData.shareUserRules.push({ couponNo: '', probability: 0 })"
            >+ 添加一项规则</a-button
          >
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
