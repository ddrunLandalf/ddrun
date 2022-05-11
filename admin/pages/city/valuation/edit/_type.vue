<template>
  <div class="home-container">
    <a-page-header :title="title + '计价规则'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item ref="ruleName" label="规则名称" prop="ruleName">
          <a-input
            v-model="formData.ruleName"
            placeholder="请输入规则名称"
            @blur="
              () => {
                $refs.ruleName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item label="距离规则" prop="ruleContext">
          <Distance v-model="formData.ruleContext.distance" />
        </a-form-model-item>

        <a-form-model-item label="重量规则" prop="ruleContext">
          <Weight v-model="formData.ruleContext.weight" />
        </a-form-model-item>

        <a-form-model-item label="时段规则" prop="ruleContext">
          <Time v-model="formData.ruleContext.time" />
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
import Distance from '@/components/valuation/Distance.vue';
import Weight from '@/components/valuation/Weight.vue';
import Time from '@/components/valuation/Time.vue';
export default EditMixin.extend({
  components: {
    Distance,
    Weight,
    Time
  },
  layout: 'global',
  data() {
    return {
      formData: {
        ruleName: '',
        ruleContext: {
          distance: [],
          weight: [],
          time: []
        }
      },
      rules: {
        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        ruleType: [{ required: true, message: '请输入规则类型', trigger: 'blur' }],
        ruleContext: [{ required: true, message: '请完善规则细节', trigger: 'blur' }]
      }
    };
  },
  computed: {
    method(): string {
      return this.isAdd ? 'cityValuationAdd' : 'cityValuationUpdate';
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.id) {
      (this.formData as any).id = parseInt(query.id as string);
      this.formData.ruleName = query.ruleName as string;
      if (this.$store.state.tempData) {
        this.formData.ruleContext = JSON.parse(JSON.stringify(this.$store.state.tempData));
      }
    }
  }
});
</script>
