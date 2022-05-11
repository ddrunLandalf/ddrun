<template>
  <div class="home-container">
    <a-page-header :title="title + '骑手'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item label="用户" prop="realname">
          <ModalUser v-model="formData.userNo" />
        </a-form-model-item>

        <a-form-model-item label="真实姓名" prop="realname">
          <a-input v-model="formData.realname" placeholder="请输入真实姓名"></a-input>
        </a-form-model-item>

        <a-form-model-item label="身份证号码" prop="idCardNo">
          <a-input v-model="formData.idCardNo" placeholder="请输入身份证号码"></a-input>
        </a-form-model-item>

        <a-form-model-item label="上传身份头像面照片" prop="avatarFaceImage">
          <upload v-model="formData.avatarFaceImage" :width="200" :height="120" />
        </a-form-model-item>

        <a-form-model-item label="上传身份国徽面照片" prop="nationalFaceImage">
          <upload v-model="formData.nationalFaceImage" :width="200" :height="120" />
        </a-form-model-item>

        <a-form-model-item label="状态">
          <a-radio-group v-model="formData.status">
            <a-radio :value="1"> 通过审核 </a-radio>
            <a-radio :value="0"> 待审核 </a-radio>
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
        userNo: '',
        idCardNo: '',
        realname: '',
        avatarFaceImage: '',
        nationalFaceImage: '',
        status: 1
      },
      rules: {
        userNo: [{ required: true, message: '请选择用户', trigger: 'blur' }],
        idCardNo: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }],
        realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        avatarFaceImage: [{ required: true, message: '请上传省份证照片面照片', trigger: 'blur' }],
        nationalFaceImage: [{ required: true, message: '请上传省份证国徽面照片', trigger: 'blur' }]
      }
    };
  },
  computed: {
    method(): string {
      return 'riderAdd';
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.userNo) {
      (this.formData as any).userNo = query.userNo as string;
      this.formData.idCardNo = query.idCardNo as string;
      this.formData.realname = query.realname as string;
      this.formData.avatarFaceImage = query.avatarFaceImage as string;
      this.formData.nationalFaceImage = query.nationalFaceImage as string;
      this.formData.status = parseInt(query.status as string);
    }
  }
});
</script>
