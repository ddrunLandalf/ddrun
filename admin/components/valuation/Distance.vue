<template>
  <div>
    <a-row v-for="(item, index) in options" :key="index" :gutter="16">
      <a-col :span="10">
        <div>范围(km):</div>
        <a-input-number
          v-model="item.gt"
          :disabled="index > 0"
          :min="index > 0 ? options[index - 1].lte : 0"
        />
        ~
        <a-input-number v-model="item.lte" :min="item.gt + 1" />
      </a-col>
      <a-col :span="6">
        <div>距离单位(km):</div>
        <a-input-number v-model="item.unitDistance" style="width: 100%" />
      </a-col>
      <a-col :span="6">
        <div>价格(元):</div>
        <a-input-number v-model="item.price" style="width: 100%" />
      </a-col>
      <a-col :span="2">
        <a-button
          style="margin-top: 44px"
          type="danger"
          shape="circle"
          icon="delete"
          @click="del(index)"
        />
      </a-col>
      <a-col :span="24">
        <span class="fo-9"
          >距离在({{ item.gt }}km~{{ item.lte }}km)范围内，<span v-if="item.unitDistance > 0"
            >每{{ item.unitDistance }}km</span
          >加价{{ item.price }}元</span
        >
      </a-col>
    </a-row>

    <a-button class="mt-20" size="large" @click="addRule">+ 添加距离规则</a-button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  model: {
    prop: 'options',
    event: 'change'
  },
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    addRule() {
      const arr = this.options as any[];
      if (arr.length === 0) {
        arr.push({ gt: 1, lte: 3, unitDistance: 1, price: 1 });
      } else if (arr.length > 0) {
        const pre = arr[this.options.length - 1];
        arr.push({ gt: pre.lte, lte: pre.lte + 3, unitDistance: 1, price: pre.price + 1 });
      }
      this.$emit('change', arr);
    },
    del(index: number) {
      const arr = this.options;
      arr.splice(index, 1);
      this.$emit('change', arr);
    }
  }
});
</script>
