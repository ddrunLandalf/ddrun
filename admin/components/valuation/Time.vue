<template>
  <div>
    <a-row v-for="(item, index) in options" :key="index" :gutter="16">
      <a-col :span="14">
        <div>范围:</div>
        <a-time-picker
          :value="moment(new Date(defaultTime + item.gt), 'HH:mm')"
          format="HH:mm"
          @change="timeChange($event, index, 'gt')"
        />
        ~
        <a-time-picker
          :value="moment(new Date(defaultTime + item.lte), 'HH:mm')"
          format="HH:mm"
          @change="timeChange($event, index, 'lte')"
        />
      </a-col>
      <a-col :span="8">
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
    </a-row>
    <a-button class="mt-20" size="large" @click="addRule">+ 添加时间段</a-button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
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
  data() {
    return {
      defaultTime: 0
    };
  },
  mounted() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    this.defaultTime = date.getTime();
  },
  methods: {
    moment,
    addRule() {
      const arr = this.options as any[];
      arr.push({ gt: 0, lte: 7 * 60 * 60 * 1000, price: 1 });

      this.$emit('change', arr);
    },
    del(index: number) {
      const arr = this.options;
      arr.splice(index, 1);
      this.$emit('change', arr);
    },
    timeChange(e: any, index: number, key: 'gt' | 'lte') {
      const time = new Date(e._d).getTime();
      (this.options as any)[index][key] = time - this.defaultTime;
    }
  }
});
</script>
