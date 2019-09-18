<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:1000px;margin:auto">
      <template>
        <p class="red--text">请根据ID在模板库中查找，根据关键字的顺序，添加关键字。然后把生成的模板ID添加到这里。</p>
        <el-table :data="formData.templates" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="title" label="标题" width="120"></el-table-column>
          <el-table-column prop="templateId" label="模板ID">
              <template slot-scope="scope">
                  <div>
                      <el-input v-model="scope.row.templateId" placeholder="输入模板ID"></el-input>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="keywords" label="关键词"></el-table-column>
        </el-table>
      </template>
      <v-btn class="mt-3 dark" :loading="tload" @click="submit()">保存</v-btn>
    </v-form>
  </v-container>
</template>

<script>
let _this;
export default {
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        templates: [{
            id:'AT0257',
            keywords:'订单状态、订单号、完成时间、订单金额',
            templateId:'_AMW26pY_uG2FPFIEYI3B2pcwIcYBBQwl5H5s9lsFl4',
            title:'订单完成通知'
        },{
            id:'AT1853',
            keywords:'订单类型、订单编号、配送地址、配送人员',
            templateId:'74i4HLS8mxaUFp-ojjriwU-EuENLOwONPXWkfaFHFRg',
            title:'配送完成通知'
        },{
            id:'AT0177',
            keywords:'配送状态、订单编号、下单时间、配送地址、配送员',
            templateId:'74i4HLS8mxaUFp-ojjriwcPZSwDiTWSc4607h48AfXw',
            title:'订单配送通知'
        },{
            id:'AT0024',
            keywords:'订单编号、订单退款、取消原因、取消人',
            templateId:'HUoEOk8ICvFE7Pg51Iqn6Z7_SYjdwV3LKFIukXRMVT8',
            title:'订单取消通知'
        },{
            id:'AT0146',
            keywords:'审核结果、拒绝理由',
            templateId:'PAkbHwMwihArUlzVjk3H_kdURzRSuzwx7se_K_nOCbI',
            title:'审核结果通知'
        }]
      },
      pageLoad: this.load,
      tload: false
    };
  },
  watch: {
    load(val) {
      if (val) {
        this.pageLoad = val;
      }
    },
    pageLoad(val) {
      if (val) {
        this.getConfig();
      }
    }
  },

  mounted() {
    _this = this;
    // _this.getConfig();
  },
  methods: {
    //获取配置
    getConfig() {
      _this.tload = true;
      this.$post(
        "config/get",
        {
          config_key: "wxapp_template"
        },
        function(res) {
          _this.tload = false;
          if (res.errno == 0) {
            if (res.data.config_content) {
              _this.formData = JSON.parse(res.data.config_content);
            }
          }
        }
      );
    },
    submit() {
      this.tload = true;
      this.$post(
        "config/update",
        {
          config_key: "wxapp_template",
          config_content: JSON.stringify(this.formData)
        },
        function(res) {
          _this.tload = false;
          if (res.errno === 0) {
            _this.$message({
              showClose: true,
              message: res.errmsg,
              type: "success"
            });
          }
        }
      );
    }
  }
};
</script>
