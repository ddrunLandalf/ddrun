<template>
  <div class="home-container">
    <a-page-header :title="title + '代理'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item ref="agentAccount" label="账户名称" prop="agentAccount">
          <a-input
            v-model="formData.agentAccount"
            placeholder="请输入账户名称"
            @blur="
              () => {
                $refs.agentAccount.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item ref="realName" label="真实姓名" prop="realName">
          <a-input
            v-model="formData.realName"
            placeholder="请输入真实姓名"
            @blur="
              () => {
                $refs.realName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item ref="mobileNumber" label="手机号" prop="mobileNumber">
          <a-input
            v-model="formData.mobileNumber"
            placeholder="请输入手机号"
            @blur="
              () => {
                $refs.mobileNumber.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="是否启用">
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
        agentAccount: '',
        mobileNumber: '',
        realName: '',
        status: 1
      },
      rules: {
        agentAccount: [{ required: true, message: '输入登录账户', trigger: 'blur' }],
        realName: [{ required: true, message: '输入真实姓名', trigger: 'blur' }],
        mobileNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    };
  },
  computed: {
    method(): string {
      return this.isAdd ? 'agentAdd' : 'agentUpdate';
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.agentNo) {
      (this.formData as any).agentNo = query.agentNo as string;
      this.formData.agentAccount = query.agentAccount as string;
      this.formData.realName = query.realName as string;
      this.formData.mobileNumber = query.mobileNumber as string;
      this.formData.status = parseInt(query.status as string);
    }
  }
});
</script>
