<template>
  <div class="home-container">
    <div class="home-page-title">运营城市列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <a-button type="primary" size="large" @click="$router.push('/city/edit/add')"
          >添加运营城市</a-button
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
      <template slot="cityNo" slot-scope="text">
        <div>{{ text.cityNo }}</div>
        <router-link :to="`/city/valuation/valuations?id=${text.citysValuationId}`"
          >【计价规则】</router-link
        >
      </template>
      <template slot="city" slot-scope="text">
        <div>{{ text.province }} - {{ text.cityName }}</div>
      </template>
      <template slot="startPrice" slot-scope="text">
        <div>{{ text.startPrice }}元</div>
      </template>

      <template slot="platform" slot-scope="text">
        <div>
          <span>送 {{ (text.extractHelpDeliver * 100).toFixed(0) }}% | </span>
          <span>取 {{ (text.extractHelpGet * 100).toFixed(0) }}% | </span>
          <span>买 {{ (text.extractHelpBuy * 100).toFixed(0) }}% </span>
        </div>
      </template>
      <template slot="agent" slot-scope="text">
        <div>
          <span>送 {{ (text.extractHelpDeliverForAgent * 100).toFixed(0) }}% | </span>
          <span>取 {{ (text.extractHelpGetForAgent * 100).toFixed(0) }}% | </span>
          <span>买 {{ (text.extractHelpBuyForAgent * 100).toFixed(0) }}% </span>
        </div>
      </template>

      <template slot="agentNo" slot-scope="text">
        <div v-if="!text.agentNo" class="fo-9">暂无代理</div>
        <agent-link v-else :no="text.agentNo"></agent-link>
      </template>

      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status" color="green"> 启用 </a-tag>
        <a-tag v-else color="red"> 禁用 </a-tag>
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
            { label: '启用', disabled: text.status === 1, key: 'status', value: 1 },
            { label: '禁用', disabled: text.status === 0, key: 'status', value: 0 }
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
      searchOptions: [
        { key: 'cityNo', type: 'text', label: '城市编号' },
        { key: 'province', type: 'text', label: '省/直辖市/自治区' },
        { key: 'cityName', type: 'text', label: '城市名称', like: true },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：全部', value: '' },
            { label: '状态：启用', value: 1 },
            { label: '状态：禁用', value: 0 }
          ],
          optionsValue: ''
        }
      ],
      columns: [
        {
          title: '编号',
          key: 'cityNo',
          scopedSlots: { customRender: 'cityNo' }
        },
        { title: '城市', key: 'city', scopedSlots: { customRender: 'city' } },
        { title: '起步价', key: 'startPrice', scopedSlots: { customRender: 'startPrice' } },
        { title: '平台抽成', key: 'extractHelpDeliver', scopedSlots: { customRender: 'platform' } },
        {
          title: '代理抽成',
          key: 'extractHelpDeliverForAgent',
          scopedSlots: { customRender: 'agent' }
        },
        { title: '代理人', key: 'agentNo', scopedSlots: { customRender: 'agentNo' } },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'cityNo',
      api: 'cityList'
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'status':
          this.updateStatus(text.cityNo, obj.value);
          break;
        case 'update':
          this.$router.push({ path: '/city/edit/update', query: text });
          break;
      }
    },
    // 修改状态
    async updateStatus(no: string, value: any) {
      const res = await (this as any).$api.cityStatus({
        cityNo: no,
        status: value
      });
      if (res.code === 200) {
        (this as any).$message.success('修改状态成功');
        this.getTableData();
      }
    }
  }
});
</script>
