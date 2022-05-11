<template>
  <div class="home-container">
    <div class="home-page-title">优惠券列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <a-button type="primary" size="large" @click="$router.push('/coupon/edit/add')"
          >添加优惠券</a-button
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
      <template slot="conditionService" slot-scope="text">
        <div>
          <a-tag v-if="text.conditionService === 'ALL'" color="green"> 所有 </a-tag>
          <a-tag v-if="text.conditionService === 'helpDeliver'" color="cyan"> 帮我送 </a-tag>
          <a-tag v-if="text.conditionService === 'helpGet'" color="blue"> 帮我取 </a-tag>
          <a-tag v-if="text.conditionService === 'helpBuy'" color="purple"> 帮我买 </a-tag>
        </div>
      </template>
      <template slot="discountAmount" slot-scope="text">
        <div>{{ text.discountAmount }}元</div>
      </template>
      <template slot="conditionsAmount" slot-scope="text">
        <div>{{ text.conditionsAmount }}元</div>
      </template>
      <template slot="deadlineDays" slot-scope="text">
        <div>{{ text.deadlineDays > -1 ? text.deadlineDays + '天' : '不限天数' }}</div>
      </template>

      <template slot="cumulativeDrawNo" slot-scope="text">
        <div>
          {{ text.cumulativeDrawNo }}/{{ text.limitNumber > -1 ? text.limitNumber : '不限' }}
        </div>
      </template>
      <template slot="cumulativeUseNo" slot-scope="text">
        <div>{{ text.cumulativeUseNo }}/{{ text.cumulativeDrawNo }}</div>
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
        { key: 'couponName', type: 'text', label: '优惠券名称', like: true },
        {
          key: 'conditionService',
          type: 'select',
          label: '优惠券类型',
          options: [
            { label: '类型：所以', value: '' },
            { label: '类型：全部类型', value: 'ALL' },
            { label: '类型：帮我送', value: 'hepDeliver' },
            { label: '类型：帮我取', value: 'hepGet' },
            { label: '类型：帮我买', value: 'hepBuy' }
          ],
          optionsValue: ''
        },
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
        { title: '优惠券名称', key: 'couponName', dataIndex: 'couponName' },
        {
          title: '适用范围',
          key: 'conditionService',
          scopedSlots: { customRender: 'conditionService' }
        },
        {
          title: '优惠金额',
          key: 'discountAmount',
          scopedSlots: { customRender: 'discountAmount' }
        },
        {
          title: '满足条件',
          key: 'conditionsAmount',
          scopedSlots: { customRender: 'conditionsAmount' }
        },
        { title: '有效天数', key: 'deadlineDays', scopedSlots: { customRender: 'deadlineDays' } },
        {
          title: '领取人数',
          key: 'cumulativeDrawNo',
          scopedSlots: { customRender: 'cumulativeDrawNo' }
        },
        {
          title: '使用人数',
          key: 'cumulativeUseNo',
          scopedSlots: { customRender: 'cumulativeUseNo' }
        },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'id',
      api: 'couponList'
      /* 非必须 */
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'update':
          this.$router.push({
            path: '/coupon/edit/update',
            query: text
          });
          break;
        case 'status':
          this.updateStatus(text.couponNo, obj.value);
          break;
      }
    },
    // 删除
    async updateStatus(couponNo: string, status: number) {
      const res = await (this as any).$api.couponStatus({
        couponNo,
        status
      });
      if (res.code === 200) {
        (this as any).$message.success(res.msg);
        this.getTableData();
      }
    }
  }
});
</script>
