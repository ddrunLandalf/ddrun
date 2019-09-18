<template>
  <v-dialog v-model="thisValue" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">添加为驾驶员</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field label="姓名" v-model="formData.realname"></v-text-field>
          <v-text-field label="身份证号码" v-model="formData.id_number"></v-text-field>
          <p>身份证有效日期</p>
          <el-date-picker
            v-model="formData.start_date"
            value="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>-
          <el-date-picker
            v-model="formData.end_date"
            value="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
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
      required: true,
      default: {
        realname: "",
        tel_number: ""
      }
    }
  },
  data() {
    return {
      thisValue: this.value,
      thisMsg: JSON.parse(JSON.stringify(this.msg)),
      loading: false,
      formData: {
          realname:'',
          id_number:'',
          start_date:'',
          end_date:''
      }
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
      this.thisMsg = val;
    }
  },
  mounted() {
    _this = this;
    // _this.getRoleData();
  },
  methods: {
    
    doUpdate() {
      this.loading = true;
      this.$post(
        "admin/service/add",
        {
          wx_id: this.thisMsg.id,
          id_number: this.formData.tel_number,
          realname: this.formData.realname,
          start_date: this.formData.start_date,
          end_date: this.formData.end_date,
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
};
</script>