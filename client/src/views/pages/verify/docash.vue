<template>
  <v-dialog v-model="thisValue" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">审核资料</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <p class="mt-4">状态</p>
          <v-radio-group v-model="thisMsg.status" :mandatory="false" row>
            <v-radio label="拒绝" :value="2"></v-radio>
            <v-radio label="通过" :value="1"></v-radio>
          </v-radio-group>
          <v-text-field label="拒绝理由" v-model="thisMsg.refuse_msg"></v-text-field>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn color="blue gray" text @click="thisValue = false">取消</v-btn>-
        <v-btn color="dark darken-1" :loading="loading" text @click="doUpdate()">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
let _this;
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    msg: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      api: this.$api,
      thisValue: this.value,
      thisMsg: JSON.parse(JSON.stringify(this.msg)),
      loading: false,
      roles: []
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    },
    msg(val) {
      this.thisMsg = JSON.parse(JSON.stringify(val));
    }
  },
  mounted() {
    _this = this;
  },
  methods: {
    doUpdate() {
      if (this.thisMsg.status == 0) {
        _this.$message({
          showClose: true,
          message: "请选择状态",
          type: "warning"
        });
      } else {
        this.loading = true;
        this.$post(
          "cash/verify",
          {
            id: this.thisMsg.id,
            status: this.thisMsg.status,
            refuse_msg: this.thisMsg.refuse_msg
          },
          function(res) {
            _this.loading = false;
            if (res.errno == 0) {
              _this.$message({
                showClose: true,
                message: res.errmsg,
                type: "success"
              });
              _this.thisValue = false;
              _this.$emit("changemsg", res);
            }
          }
        );
      }
    }
  }
};
</script>