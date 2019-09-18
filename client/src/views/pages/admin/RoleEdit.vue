<template>
  <v-dialog v-model="thisValue" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{resType === 'add' ? '添加角色':'修改角色'}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-text-field
              label="角色名称*"
              placeholder="输入角色名称"
              :rules="[v => !!v || '角色名称必填']"
              required
              v-model="thisMsg.role_name"
            ></v-text-field>
            <v-text-field label="备注" placeholder="输入备注信息" v-model="thisMsg.remarks"></v-text-field>
            <v-text-field label="序号" placeholder="输入序号" v-model="thisMsg.sort"></v-text-field>
            <div>
              <span>是否启用：</span>
              <el-switch
                v-model="thisMsg.status"
                active-color="#13ce66"
                inactive-color="#e1e1e1"
                :inactive-value="0"
                :active-value="1"
              ></el-switch>
            </div>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn color="blue gray" text @click="thisValue = false">取消</v-btn>
        <v-btn color="dark darken-1" :loading="loading" text @click="doUpdate()">保存</v-btn>
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
      required: false,
      default: {
        role_name: "",
        remarks: "",
        sort: "",
        status: 0
      }
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      valid: true,
      resType: this.type,
      thisValue: this.value,
      thisMsg: JSON.parse(JSON.stringify(this.msg)),
      loading: false
    };
  },
  watch: {
    value(newVal) {
      this.thisValue = newVal;
    },
    thisValue(newVal) {
      this.$emit("change", newVal);
    },
    type(val){
      this.resType = val;
      if(val === 'add'){
          this.thisMsg = {
              role_name: "",
              remarks: "",
              sort: "",
              status: 0
          }
      }
    },
    msg(val) {
      this.thisMsg = val;
    }
  },
  mounted() {
    _this = this;
  },
  methods: {
    doUpdate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$post(
          "role/" + this.resType,
          {
            id: this.thisMsg.id || "",
            role_name: this.thisMsg.role_name,
            remarks: this.thisMsg.remarks,
            sort: this.thisMsg.sort,
            status: this.thisMsg.status
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