<template>
  <div class="home-container">
    <a-page-header :title="title + '优惠券'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="优惠券名称" prop="couponName">
          <a-input v-model="formData.couponName" placeholder="请输入优惠券名称"></a-input>
        </a-form-model-item>

        <a-form-model-item prop="discountAmount">
          <a-row :gutter="20">
            <a-col :span="12">
              <div>优惠金额:</div>
              <a-input-number
                v-model="formData.discountAmount"
                style="width: 100%"
                placeholder="请输入优惠金额"
              />
            </a-col>
            <a-col :span="12">
              <div>满足条件金额:</div>
              <a-input-number
                v-model="formData.conditionsAmount"
                style="width: 100%"
                placeholder="满足多少金额才能优惠"
              />
            </a-col>
          </a-row>
        </a-form-model-item>

        <a-form-model-item label="优惠券类型" prop="conditionService">
          <a-select
            v-model="formData.conditionService"
            style="width: 100%"
            placeholder="请选择优惠券类型"
          >
            <a-select-option
              v-for="(item, index) in conditionServices"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="有效天数" prop="deadlineDays">
          <a-input v-model="formData.deadlineDays" placeholder="请输入有效天数"></a-input>
          <div class="fo-9">领取后开始计算到期时间, -1为不限</div>
        </a-form-model-item>

        <a-form-model-item label="限制领取数量" prop="limitNumber">
          <a-input-number
            v-model="formData.limitNumber"
            style="width: 50%"
            placeholder="请输入限制数量"
          ></a-input-number>
          <div class="fo-9">限制领取数量， -1为不限制</div>
        </a-form-model-item>

        <a-form-model-item label="状态">
          <a-radio-group v-model="formData.status">
            <a-radio :value="1"> 启用 </a-radio>
            <a-radio :value="0"> 禁用 </a-radio>
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
export default EditMixin.extend({
  layout: 'global',
  data() {
    return {
      formData: {
        couponName: '',
        deadlineDays: -1,
        discountAmount: 0,
        conditionsAmount: 0,
        conditionService: 'ALL',
        limitNumber: -1,
        status: 1
      },
      rules: {
        couponName: [{ required: true, message: '优惠券名称必填', trigger: 'blur' }],
        limitNumber: [{ required: true, message: '请设置领取限制数量', trigger: 'blur' }],
        conditionService: [{ required: true, message: '请选择优惠券的类型', trigger: 'blur' }],
        discountAmount: [{ required: true, message: '请输入优惠金额', trigger: 'blur' }]
      },
      conditionServices: [
        { label: '全部', value: 'ALL' },
        { label: '帮我送', value: 'helpDeliver' },
        { label: '帮我取', value: 'helpGet' },
        { label: '帮我买', value: 'helpBuy' }
      ]
    };
  },
  computed: {
    method(): string {
      return this.isAdd ? 'couponAdd' : 'couponUpdate';
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.couponNo) {
      (this.formData as any).couponNo = query.couponNo as string;
      this.formData.couponName = query.couponName as string;
      this.formData.deadlineDays = parseInt(query.deadlineDays as string);
      this.formData.discountAmount = parseFloat(query.discountAmount as string);
      this.formData.conditionsAmount = parseFloat(query.conditionsAmount as string);
      this.formData.conditionService = query.conditionService as string;
      this.formData.limitNumber = parseFloat(query.limitNumber as string);
      this.formData.status = parseInt(query.status as string);
    }
  }
});
</script>
