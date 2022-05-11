<template>
  <div class="home-container">
    <a-page-header :title="title + '城市'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item ref="cityName" label="运营城市" prop="cityName">
          <a-cascader
            :value="[formData.province, formData.cityName]"
            :options="citys"
            :field-names="{ label: 'name', value: 'name', children: 'children' }"
            placeholder="请选择一个城市"
            @change="chooseCityChange"
          />
        </a-form-model-item>
        <a-form-model-item label="平台抽点">
          <a-row :gutter="24">
            <a-col :span="8">
              <div>帮我送</div>
              <a-input-number
                v-model="formData.extractHelpDeliver"
                style="width: 100%"
                :min="0"
                :max="1"
                :step="0.01"
              ></a-input-number>
            </a-col>
            <a-col :span="8">
              <div>帮我取</div>
              <a-input-number
                v-model="formData.extractHelpGet"
                style="width: 100%"
                :min="0"
                :max="1"
                :step="0.01"
              ></a-input-number>
            </a-col>
            <a-col :span="8">
              <div>帮我买</div>
              <a-input-number
                v-model="formData.extractHelpBuy"
                style="width: 100%"
                :min="0"
                :max="1"
                :step="0.01"
              ></a-input-number>
            </a-col>
          </a-row>
          <div class="fo-9">输入小于1的数值</div>
        </a-form-model-item>

        <a-form-model-item label="代理抽点">
          <a-row :gutter="24">
            <a-col :span="8">
              <div>帮我送</div>
              <a-input-number
                v-model="formData.extractHelpDeliverForAgent"
                style="width: 100%"
                :min="0"
                :max="1"
                :step="0.01"
              ></a-input-number>
            </a-col>
            <a-col :span="8">
              <div>帮我取</div>
              <a-input-number
                v-model="formData.extractHelpGetForAgent"
                style="width: 100%"
                :min="0"
                :max="1"
                :step="0.01"
              ></a-input-number>
            </a-col>
            <a-col :span="8">
              <div>帮我买</div>
              <a-input-number
                v-model="formData.extractHelpBuyForAgent"
                style="width: 100%"
                :min="0"
                :max="1"
                :step="0.01"
              ></a-input-number>
            </a-col>
          </a-row>
          <div class="fo-9">输入小于1的数值</div>
        </a-form-model-item>

        <a-form-model-item label="起步价">
          <a-input-number v-model="formData.startPrice" placeholder="请输入起步价格" />
        </a-form-model-item>

        <a-form-model-item label="计价规则">
          <a-select
            v-model="formData.citysValuationId"
            placeholder="请选择一个计价规则"
            style="width: 100%"
          >
            <a-select-option v-for="(item, index) in valuations" :key="index" :value="item.id">
              {{ item.ruleName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="重量标签">
          <a-select
            v-model="formData.citysWeightTagId"
            placeholder="请选择一个重量标签"
            style="width: 100%"
          >
            <a-select-option v-for="(item, index) in weights" :key="index" :value="item.id">
              {{ item.tagName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="物品标签组">
          <a-select
            v-model="formData.citysTagGroupId"
            placeholder="请选择一个物品标签组"
            style="width: 100%"
          >
            <a-select-option v-for="(item, index) in tags" :key="index" :value="item.id">
              {{ item.groupName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="代理人">
          <a-select
            :value="{ key: formData.agentNo }"
            label-in-value
            placeholder="输入姓名搜索"
            style="width: 100%"
            :filter-option="false"
            show-search
            :not-found-content="fetching ? undefined : null"
            @search="fetchAgent"
            @change="agentChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in agents" :key="d.agentNo" :value="d.agentNo">
              {{ d.realName }}-{{ d.agentAccount }}
            </a-select-option>
          </a-select>
          <div class="fo-9">输入姓名搜索并选择</div>
        </a-form-model-item>

        <a-form-model-item label="运营状态">
          <a-radio-group v-model="formData.status" :disabled="!formData.agentNo">
            <a-radio :value="1"> 运营 </a-radio>
            <a-radio :value="0"> 关闭 </a-radio>
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
import { pacData } from '@/plugins/city';
export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        cityName: '',
        province: '',
        agentNo: '',
        extractHelpDeliver: 0,
        extractHelpGet: 0,
        extractHelpBuy: 0,
        extractHelpDeliverForAgent: 0,
        extractHelpGetForAgent: 0,
        extractHelpBuyForAgent: 0,
        status: 0,
        startPrice: 0,
        citysValuationId: 0 as number,
        citysWeightTagId: 0,
        citysTagGroupId: 0
      },
      rules: {
        cityName: [{ required: true, message: '城市必填', trigger: 'blur' }]
      },
      citys: pacData,
      fetching: false,
      agents: [],
      valuations: [],
      weights: [],
      tags: []
    };
  },
  computed: {
    method(): string {
      return this.isAdd ? 'cityAdd' : 'cityUpdate';
    }
  },
  mounted() {
    const query = this.$route.query;

    if (query.cityNo) {
      (this.formData as any).cityNo = query.cityNo as string;
      this.formData.cityName = query.cityName as string;
      this.formData.province = query.province as string;
      this.formData.extractHelpDeliver = parseFloat(query.extractHelpDeliver as string);
      this.formData.extractHelpGet = parseFloat(query.extractHelpGet as string);
      this.formData.extractHelpBuy = parseFloat(query.extractHelpBuy as string);
      this.formData.extractHelpDeliverForAgent = parseInt(
        query.extractHelpDeliverForAgent as string
      );
      this.formData.extractHelpGetForAgent = parseFloat(query.extractHelpGetForAgent as string);
      this.formData.extractHelpBuyForAgent = parseFloat(query.extractHelpBuyForAgent as string);
      this.formData.agentNo = query.agentNo as string;
      this.formData.startPrice = parseFloat(query.startPrice as string);
      this.formData.citysValuationId = parseInt(query.citysValuationId as string);
      this.formData.citysWeightTagId = parseInt(query.citysWeightTagId as string);
      this.formData.citysTagGroupId = parseInt(query.citysTagGroupId as string);
      this.formData.status = parseInt(query.status as string);
      this.fetchAgent(this.formData.agentNo, 'agentNo');
    }
    this.getValuations();
    this.getWeights();
    this.getTags();
  },
  methods: {
    chooseCityChange(e: string[]) {
      this.formData.province = e[0];
      this.formData.cityName = e[1];
    },
    async getValuations() {
      const result = await (this as any).$api.cityValuationList({ current: 1, pageSize: 1000 });
      if (result.code === 200) {
        this.valuations = result.data.data;
      }
    },
    async getWeights() {
      const result = await (this as any).$api.weightList({ current: 1, pageSize: 1000 });
      if (result.code === 200) {
        this.weights = result.data.data;
      }
    },
    async getTags() {
      const result = await (this as any).$api.tagGroupList({ current: 1, pageSize: 1000 });
      if (result.code === 200) {
        this.tags = result.data.data;
      }
    },
    async fetchAgent(value: string, key = 'realName' as 'realName' | 'agentNo') {
      this.fetching = true;
      const result = await (this as any).$api.agentList({
        current: 1,
        pageSize: 20,
        [key]: value
      });
      if (result.code === 200) {
        this.agents = result.data.data;
      }
      this.fetching = false;
    },
    agentChange(e: { key: string }) {
      this.formData.agentNo = e.key;
    }
  }
});
</script>
