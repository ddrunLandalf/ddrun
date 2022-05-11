<template>
  <div class="home-container">
    <div class="home-page-title">取消订单配置</div>
    <div class="edit-content mt-20">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="用户取消订单规则">
          <div class="fo-9 fo-12">用户在订单状态为【已接单、配送中】时取消订单会触发此规则</div>
          <a-row v-for="(item, index) in formData.userCancelRules" :key="index" :gutter="16">
            <a-col :span="14">
              <div>时间范围(分钟):</div>
              <a-input-number v-model="item.timeRange[0]" style="width: 130px" /> ~
              <a-input-number v-model="item.timeRange[1]" style="width: 130px" />
            </a-col>
            <a-col :span="6">
              <div>超时费用比例:</div>
              <a-input-number v-model="item.price" />
            </a-col>
            <a-col :span="2">
              <a-button
                style="margin-top: 44px"
                type="danger"
                shape="circle"
                icon="delete"
                @click="del('userCancelRules', index)"
              />
            </a-col>
          </a-row>

          <a-button class="mt-12" size="large" @click="addItem('userCancelRules')"
            >+ 添加一项</a-button
          >
        </a-form-model-item>

        <a-form-model-item label="骑手取消订单规则">
          <div class="fo-9 fo-12">骑手在订单状态为【已接单、配送中】时取消订单会触发此规则</div>
          <a-row v-for="(item, index) in formData.riderCancelRules" :key="index" :gutter="16">
            <a-col :span="14">
              <div>时间范围(分钟):</div>
              <a-input-number v-model="item.timeRange[0]" style="width: 130px" /> ~
              <a-input-number v-model="item.timeRange[1]" style="width: 130px" />
            </a-col>
            <a-col :span="6">
              <div>超时费用比例:</div>
              <a-input-number v-model="item.price" />
            </a-col>
            <a-col :span="2">
              <a-button
                style="margin-top: 44px"
                type="danger"
                shape="circle"
                icon="delete"
                @click="del('riderCancelRules', index)"
              />
            </a-col>
          </a-row>

          <a-button class="mt-12" size="large" @click="addItem('riderCancelRules')"
            >+ 添加一项</a-button
          >
        </a-form-model-item>

        <a-form-model-item label="用户取消订单选项配置">
          <a-row
            v-for="(item, index) in formData.userCancelTips"
            :key="index"
            class="mb-8"
            :gutter="16"
          >
            <a-col :span="22">
              <a-input v-model="formData.userCancelTips[index]"></a-input>
            </a-col>
            <a-col :span="2">
              <a-button
                type="danger"
                shape="circle"
                icon="delete"
                @click="del('userCancelTips', index)"
              />
            </a-col>
          </a-row>
          <a-button class="mt-12" size="large" @click="addTipItem('userCancelTips')"
            >+ 添加一项</a-button
          >
        </a-form-model-item>
        <a-form-model-item label="骑手取消订单选项配置">
          <a-row
            v-for="(item, index) in formData.riderCancelTips"
            :key="index"
            class="mb-8"
            :gutter="16"
          >
            <a-col :span="22">
              <a-input v-model="formData.riderCancelTips[index]"></a-input>
            </a-col>
            <a-col :span="2">
              <a-button
                type="danger"
                shape="circle"
                icon="delete"
                @click="del('riderCancelTips', index)"
              />
            </a-col>
          </a-row>
          <a-button class="mt-12" size="large" @click="addTipItem('riderCancelTips')"
            >+ 添加一项</a-button
          >
        </a-form-model-item>
        <a-form-model-item label="管理员取消订单选项配置">
          <a-row
            v-for="(item, index) in formData.adminCancelTips"
            :key="index"
            class="mb-8"
            :gutter="16"
          >
            <a-col :span="22">
              <a-input v-model="formData.adminCancelTips[index]"></a-input>
            </a-col>
            <a-col :span="2">
              <a-button
                type="danger"
                shape="circle"
                icon="delete"
                @click="del('adminCancelTips', index)"
              />
            </a-col>
          </a-row>
          <a-button class="mt-12" size="large" @click="addTipItem('adminCancelTips')"
            >+ 添加一项</a-button
          >
        </a-form-model-item>
        <a-form-model-item label="代理取消订单选项配置">
          <a-row
            v-for="(item, index) in formData.agentCancelTips"
            :key="index"
            class="mb-8"
            :gutter="16"
          >
            <a-col :span="22">
              <a-input v-model="formData.agentCancelTips[index]"></a-input>
            </a-col>
            <a-col :span="2">
              <a-button
                type="danger"
                shape="circle"
                icon="delete"
                @click="del('agentCancelTips', index)"
              />
            </a-col>
          </a-row>
          <a-button class="mt-12" size="large" @click="addTipItem('agentCancelTips')"
            >+ 添加一项</a-button
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
import Vue from 'vue';
interface OrderCancelRule {
  timeRange: number[];
  price: number;
}
export default Vue.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        userCancelRules: [] as OrderCancelRule[],
        riderCancelRules: [] as OrderCancelRule[],

        userCancelTips: [] as string[],

        adminCancelTips: [] as string[],

        agentCancelTips: [] as string[],

        riderCancelTips: [] as string[]
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
      const result = await (this as any).$api.adminCancelOrderGet();
      if (result.code === 200 && result.data) {
        this.formData = result.data;
      }
    },
    submit() {
      (this.$refs as any).ruleForm.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          const result = await (this as any).$api.adminCancelOrderPost(this.formData);
          this.loading = false;
          if (result.code === 200) {
            (this as any).$message.success(result.msg);
          }
        } else {
          return false;
        }
      });
    },
    // 添加一项
    addItem(type: 'userCancelRules' | 'riderCancelRules') {
      const len = this.formData[type].length;
      if (len === 0) {
        this.formData[type].push({ timeRange: [0, 3], price: 0 });
      } else {
        this.formData[type].push({
          timeRange: [
            this.formData[type][len - 1].timeRange[1],
            this.formData[type][len - 1].timeRange[1] + 3
          ],
          price: this.formData[type][len - 1].price + 0.1
        });
      }
    },
    addTipItem(type: 'userCancelTips' | 'adminCancelTips' | 'agentCancelTips' | 'riderCancelTips') {
      this.formData[type].push('');
    },
    del(
      type:
        | 'userCancelRules'
        | 'riderCancelRules'
        | 'userCancelTips'
        | 'adminCancelTips'
        | 'agentCancelTips'
        | 'riderCancelTips',
      index: number
    ) {
      this.formData[type].splice(index, 1);
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
