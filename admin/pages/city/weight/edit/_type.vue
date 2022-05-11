<template>
  <div class="home-container">
    <a-page-header :title="title + '重量标签'" @back="() => $router.go(-1)"> </a-page-header>
    <div class="edit-content">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules">
        <a-form-model-item ref="tagName" label="标签名称" prop="tagName">
          <a-input
            v-model="formData.tagName"
            placeholder="请输入标签名称"
            @blur="
              () => {
                $refs.tagName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item label="重量标签" prop="tags">
          <a-button size="large" @click="add">+ 添加一项</a-button>
          <a-row v-for="(item, index) in formData.tags" :key="index" class="mt-12" :gutter="12">
            <a-col :span="8">
              <div>标签名称</div>
              <a-input v-model="item.label" placeholder="请输入标签"></a-input>
            </a-col>
            <a-col :span="12">
              <div>
                取值：
                <a-radio-group v-model="item.type" @change="radioChange($event, index)">
                  <a-radio value="eq"> 值 </a-radio>
                  <a-radio value="range"> 范围 </a-radio>
                </a-radio-group>
              </div>
              <a-input-number
                v-if="item.type === 'eq'"
                v-model="item.value"
                placeholder="请输入值"
              />
              <div v-else>
                <a-input-number v-model="item.value[0]" :min="0" placeholder="请输入最小值" /> ~
                <a-input-number
                  v-model="item.value[1]"
                  :min="item.value[0]"
                  placeholder="请输入最大值"
                />
              </div>
            </a-col>
            <a-col :span="4">
              <a-button
                style="margin-top: 44px"
                type="danger"
                shape="circle"
                icon="delete"
                @click="del(index)"
              />
            </a-col>
          </a-row>
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
        tagName: '',
        tags: [] as any[]
      },
      rules: {
        tagName: [{ required: true, message: '请输入重量标签名称', trigger: 'blur' }],
        tags: [{ required: true, message: '请添加一些标签', trigger: 'blur' }]
      }
    };
  },
  computed: {
    method(): string {
      return this.isAdd ? 'weightAdd' : 'weightUpdate';
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.id) {
      (this.formData as any).id = parseInt(query.id as string);
      this.formData.tagName = query.tagName as string;
      this.formData.tags = JSON.parse(JSON.stringify(this.$store.state.tempData));
    }
  },
  methods: {
    add() {
      this.formData.tags.push({ label: '', type: 'range', value: [0, 1] });
    },
    radioChange(e: any, index: number) {
      if (e.target.value === 'eq') {
        this.formData.tags[index].value = '';
      } else {
        this.formData.tags[index].value = [0, 1];
      }
    },
    del(index: number) {
      this.formData.tags.splice(index, 1);
    }
  }
});
</script>
