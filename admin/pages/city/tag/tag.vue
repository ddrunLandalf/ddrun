<template>
  <div class="home-container">
    <div class="home-page-title">物品标签组列表</div>
    <Search class="mt-20" :options="searchOptions" @change="searchChange" />
    <div class="flex flex-between item-center">
      <div class="flex flex-start item-cencer">
        <a-button type="primary" size="large" @click="$router.push('/city/tag/edit/add')"
          >添加物品标签组</a-button
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
      <template slot="tags" slot-scope="text">
        <div>{{ text.tags.toString() }}</div>
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
      searchOptions: [{ key: 'groupName', type: 'text', label: '标签组名称', like: true }],
      columns: [
        { title: '标签组名称', key: 'groupName', dataIndex: 'groupName' },
        { title: '标签', key: 'tags', scopedSlots: { customRender: 'tags' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'id',
      api: 'tagGroupList'
      /* 非必须 */
    };
  },

  methods: {
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'update':
          this.$store.commit('setTempData', text.tags);
          this.$router.push({
            path: '/city/tag/edit/update',
            query: { id: text.id, groupName: text.groupName, tags: text.tags.toString() }
          });
          break;
        case 'delete':
          this.del(text.id);
          break;
      }
    },
    // 删除
    async del(id: number) {
      const res = await (this as any).$api.tagGroupDel({
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
