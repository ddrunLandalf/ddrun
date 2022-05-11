<template>
  <div class="home-container">
    <div class="home-page-title">骑手列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <a-button type="primary" size="large" @click="$router.push('/rider/edit/add')"
          >新增一位骑手</a-button
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
      <template slot="user" slot-scope="text">
        <div
          class="flex flex-start item-center pointer"
          @click="$router.push({ path: '/user/users', query: { userNo: text.userNo } })"
        >
          <a-avatar icon="user" :size="32" :src="text.avatarUrl" />
          <div class="ml-8 fo-12">
            <div>{{ text.nickName }}</div>
            <div class="fo-9">{{ text.mobileNumber }}</div>
          </div>
        </div>
      </template>

      <template slot="realname" slot-scope="text">
        <div>{{ text.realname || '----' }}</div>
      </template>

      <template slot="accountBalance" slot-scope="text">
        <div>{{ text.accountBalance }}元</div>
      </template>

      <template slot="startReceive" slot-scope="text">
        <a-switch
          :checked="text.startReceive === 1 ? true : false"
          @change="receiveChange(text.riderNo, text.startReceive === 1 ? false : true)"
        />
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
        <Action
          :options="[
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
        { key: 'riderNo', type: 'text', label: '骑手编号' },
        { key: 'userNo', type: 'text', label: '用户编号', like: true },
        { key: 'realname', type: 'text', label: '真实姓名', like: true },
        { key: 'idCardNo', type: 'text', label: '身份证号码', like: true },
        { key: 'mobileNumber', type: 'text', label: '手机号', like: true },
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
          key: 'riderNo',
          dataIndex: 'riderNo'
        },
        { title: '用户', key: 'user', scopedSlots: { customRender: 'user' } },
        { title: '身份', key: 'realname', scopedSlots: { customRender: 'realname' } },
        {
          title: '账户余额',
          key: 'accountBalance',
          scopedSlots: { customRender: 'accountBalance' }
        },
        {
          title: '开启接单',
          key: 'startReceive',
          scopedSlots: { customRender: 'startReceive' }
        },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'riderNo',
      api: 'riderList'
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'status':
          this.updateStatus(text.userNo, obj.value);
          break;
      }
    },
    // 修改状态
    async updateStatus(userNo: string, value: any) {
      const res = await (this as any).$api.userStatus({
        userNo,
        status: value
      });
      if (res.code === 200) {
        (this as any).$message.success('修改状态成功');
        this.getTableData();
      }
    },
    // 接单状态修改
    async receiveChange(riderNo: string, startReceive: boolean) {
      const res = await (this as any).$api.riderReceiveSet({
        riderNo,
        startReceive
      });
      if (res.code === 200) {
        this.getTableData();
      }
    }
  }
});
</script>
