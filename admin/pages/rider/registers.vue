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
      <template slot="avatarFaceImage" slot-scope="text">
        <img :src="imageCenterCrop(text.avatarFaceImage, 150, 100)" alt="" />
      </template>

      <template slot="nationalFaceImage" slot-scope="text">
        <img :src="imageCenterCrop(text.nationalFaceImage, 150, 100)" alt="" />
      </template>

      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status === 0" color="blue"> 待审核 </a-tag>
        <a-tag v-else-if="text.status === 1" color="green"> 通过审核 </a-tag>
        <a-tag v-else-if="text.status === 2" color="red"> 未通过 </a-tag>
        <div v-if="text.status === 2" class="fo-12 mt-8 fo-9">{{ text.refuseReason }}</div>
      </template>
      <template slot="createTime" slot-scope="text">
        <div class="fo-12">创建:{{ dayjs(text.createTime).format('YYYY/MM/DD HH:mm') }}</div>
        <div class="fo-12">更新:{{ dayjs(text.updateTime).format('YYYY/MM/DD HH:mm') }}</div>
      </template>
      <template slot="action" slot-scope="text">
        <Action
          :options="[
            { label: '通过审核', disabled: text.status === 1, key: 'pass' },
            { label: '拒绝通过', disabled: text.status === 2, key: 'refuse' }
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
    <Refuse v-model="visible" :no="tempUserNo" @success="getTableData" />
  </div>
</template>
<script lang="ts">
import TableDataMixins from '@/plugins/mixins/table-data-mixin.vue';
import { imageCenterCrop } from '@/plugins/oss';
import Refuse from '@/components/rider/Refuse.vue';
export default TableDataMixins.extend({
  components: {
    Refuse
  },
  data() {
    return {
      /* ---- 必要参数 start ---- */
      query: {
        current: 1,
        pageSize: 20
      },
      searchOptions: [
        { key: 'userNo', type: 'text', label: '用户编号', like: true },
        { key: 'realname', type: 'text', label: '真实姓名', like: true },
        { key: 'idCardNo', type: 'text', label: '身份证号码', like: true },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '状态：全部', value: '' },
            { label: '状态：待审核', value: 0 },
            { label: '状态：已通过', value: 1 },
            { label: '状态：未通过', value: 2 }
          ],
          optionsValue: ''
        }
      ],
      columns: [
        {
          title: '用户编号',
          key: 'userNo',
          dataIndex: 'userNo'
        },
        { title: '姓名', key: 'realname', dataIndex: 'realname' },
        { title: '身份证号码', key: 'idCardNo', dataIndex: 'idCardNo' },
        {
          title: '身份证头像照片',
          key: 'avatarFaceImage',
          scopedSlots: { customRender: 'avatarFaceImage' }
        },
        {
          title: '身份证国徽照片',
          key: 'nationalFaceImage',
          scopedSlots: { customRender: 'nationalFaceImage' }
        },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作', key: 'id', scopedSlots: { customRender: 'action' } }
      ],
      rowKey: 'id',
      api: 'riderRegisterList',

      tempUserNo: '',
      visible: false
    };
  },

  methods: {
    imageCenterCrop,
    // 操作点击
    actionClick(obj: { key: string; value: any }, text: any) {
      switch (obj.key) {
        case 'pass':
          this.pass(text.userNo);
          break;
        case 'refuse':
          this.tempUserNo = text.userNo;
          this.visible = true;
          break;
      }
    },

    async pass(userNo: string) {
      const res = await (this as any).$api.riderPass({
        userNo
      });
      if (res.code === 200) {
        (this as any).$message.success('操作成功');
        this.getTableData();
      }
    }
  }
});
</script>
