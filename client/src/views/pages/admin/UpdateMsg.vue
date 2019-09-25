<template>
  <v-dialog v-model="thisValue" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">修改信息</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field label="姓名" v-model="thisMsg.realname"></v-text-field>
          <v-text-field label="手机号" v-model="thisMsg.tel_number"></v-text-field>
          <v-select
            v-model="thisMsg.role_id"
            :items="roles"
            :rules="[v => !!v || '请选择一个角色']"
            required
            label="选择一个角色*"
            item-text="role_name"
            item-value="id"
            ></v-select>
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
      roles:[]
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
    _this.getRoleData();
  },
  methods: {
    //获取角色数据
    getRoleData() {
        this.$post('role/list',{
            status:1,
            sorts:'sort asc',
            currentPage:1,
            pageSize:100
        },function(res){
            if(res.errno === 0){
                _this.roles = res.data.data;
            }
        })
    },
    doUpdate() {
      this.loading = true;
      this.$post(
        "admin/updateMsg",
        {
          id: this.thisMsg.id,
          tel_number: this.thisMsg.tel_number,
          realname: this.thisMsg.realname,
          role_id:this.thisMsg.role_id
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