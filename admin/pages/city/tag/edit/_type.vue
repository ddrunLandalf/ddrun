<template>
  <div class="home-container">
    <a-page-header :title="title + '物品标签组'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item ref="groupName" label="物品标签组名称" prop="groupName">
          <a-input
            v-model="formData.groupName"
            placeholder="请输入物品标签组名称"
            @blur="
              () => {
                $refs.groupName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item label="标签" prop="tags">
          <a-select
            v-model="formData.tags"
            mode="tags"
            style="width: 100%"
            :token-separators="[',']"
          >
          </a-select>
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
        groupName: '',
        tags: [] as string[]
      },
      rules: {
        tagName: [{ required: true, message: '请输入标签组名称', trigger: 'blur' }],
        tags: [{ required: true, message: '请添加一些标签', trigger: 'blur' }]
      }
    };
  },
  computed: {
    method(): string {
      return this.isAdd ? 'tagGroupAdd' : 'tagGroupUpdate';
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.id) {
      (this.formData as any).id = parseInt(query.id as string);
      this.formData.groupName = query.groupName as string;
      this.formData.tags = (query.tags as string).split(',');
    }
  },
  methods: {
    del(index: number) {
      this.formData.tags.splice(index, 1);
    }
  }
});
</script>
