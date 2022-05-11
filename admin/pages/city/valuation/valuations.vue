<template>
  <div class="home-container">
    <div class="home-page-title">计价规则列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <a-button type="primary" size="large" @click="$router.push('/city/valuation/edit/add')"
          >添加计价规则</a-button
        >
      </div>
      <div class="flex flex-end item-center">
        <a-button size="large" icon="redo" :loading="loading" @click="getTableData()"> </a-button>
      </div>
    </div>
    <a-table
      class="mt-20"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :row-key="rowKey"
      :columns="columns"
      :data-source="tabelData"
      :pagination="false"
      :loading="loading"
      bordered
    >
      <template slot="distanceContext" slot-scope="text">
        <div v-for="(item, index) in text.ruleContext.distance" :key="index">
          在{{ item.gt }}~{{ item.lte }}公里范围内，<span v-if="item.unitDistance > 0"
            >每{{ item.unitDistance }}公里</span
          >加价{{ item.price }}元
        </div>
      </template>
      <template slot="weightContext" slot-scope="text">
        <div v-for="(item, index) in text.ruleContext.weight" :key="index">
          在{{ item.gt }}~{{ item.lte }}公斤范围内，<span v-if="item.unitWeight > 0"
            >每{{ item.unitWeight }}公斤</span
          >加价{{ item.price }}元
        </div>
      </template>

      <template slot="timeContext" slot-scope="text">
        <div v-for="(item, index) in text.ruleContext.weight" :key="index">
          在{{ item.gt }}~{{ item.lte }}时间段内，加价{{ item.price }}元
        </div>
      </template>

      <template slot="createTime" slot-scope="text">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="action" slot-scope="text">
        <admin-link :no="text.updatedBy" />
        <Action
          :options="[
            { label: '修改', key: 'update' },
            { label: '删除', key: 'delete' }
          ]"
          @click-item="actionClick($event, text)"
        />
      </template>
    </a-table>
    <div class="mt-20 flex flex-end">
      <a-pagination
        v-model="query.current"
        size="small"
        :total="count"
        :page-size="query.pageSize"
        show-quick-jumper
        :show-total="total => `共 ${total} 条数据`"
        @change="pageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import TableDataMixins from '@/plugins/mixins/table-data-mixin.vue';
export default TableDataMixins.extend({
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 20
      },
      searchOptions: [{ key: 'ruleName', type: 'text', label: '规则名称', like: true }],
      columns: [
        { title: '规则名称', key: 'ruleName', dataIndex: 'ruleName' },
        { title: '距离规则', key: 'ruleContext', scopedSlots: { customRender: 'distanceContext' } },
        { title: '重量规则', key: 'ruleContext1', scopedSlots: { customRender: 'weightContext' } },
        { title: '时间规则', key: 'ruleContext2', scopedSlots: { customRender: 'timeContext' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'id',
      api: 'cityValuationList'
      /* 非必须 */
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'update':
          this.$store.commit('setTempData', text.ruleContext);
          this.$router.push({
            path: '/city/valuation/edit/update',
            query: text
          });
          break;
        case 'delete':
          this.del(text.id);
          break;
      }
    },
    // 删除
    async del(id: number) {
      const res = await (this as any).$api.cityValuationDel({
        id
      });
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.getTableData();
      }
    }
  }
});
</script>
