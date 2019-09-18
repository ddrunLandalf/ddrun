<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <v-text-field v-model="formData.freeCancelTime" label="接单后免费取消时间(单位：分钟)"></v-text-field>
      <v-text-field v-model="formData.bearCostRate" label="超出免费取消时间后需承担百分之多少的费用(填写<1的数值)"></v-text-field>
      <p class="mt-4">设置用户取消订单理由</p>
      <p>
        <el-tag
          :key="tag"
          v-for="(tag,index) in formData.userReasons"
          closable
          :disable-transitions="false"
          @close="handleClose(index)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加理由</el-button>
      </p>
      <p class="mt-4">设置跑男取消订单理由</p>
      <p>
        <el-tag
          :key="tag"
          v-for="(tag,index) in formData.runmanReasons"
          closable
          :disable-transitions="false"
          @close="handleClose2(index)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible2"
          v-model="inputValue2"
          ref="saveTagInput2"
          size="small"
          @keyup.enter.native="handleInputConfirm2"
          @blur="handleInputConfirm2"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput2">+ 添加理由</el-button>
      </p>
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
      inputVisible: false,
      inputValue: "",
      inputVisible2: false,
      inputValue2: "",
      formData: {
        freeCancelTime: "",
        bearCostRate: "",
        userReasons: [],
        runmanReasons: []
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
          config_key: "cancel_order"
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
          config_key: "cancel_order",
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
    },
    handleClose(tag) {
      this.formData.userReasons.splice(
        tag,
        1
      );
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.formData.userReasons.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleClose2(tag) {
      this.formData.runmanReasons.splice(
        tag,
        1
      );
    },

    showInput2() {
      this.inputVisible2 = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput2.$refs.input.focus();
      });
    },

    handleInputConfirm2() {
      let inputValue = this.inputValue2;
      if (inputValue) {
        this.formData.runmanReasons.push(inputValue);
      }
      this.inputVisible2 = false;
      this.inputValue2 = "";
    }
  }
};
</script>
