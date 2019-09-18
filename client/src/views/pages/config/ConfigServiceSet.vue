<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      <p>城市代理</p>
      <v-radio-group v-model="formData.open_agent" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>

      <p>跨城服务</p>
      <v-radio-group v-model="formData.cross_city_service" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>

      <p>帮我送服务</p>
      <v-radio-group v-model="formData.send_service" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>
      <v-text-field v-model="formData.init_send_time" type="number" label="帮我送初始接单时间" ></v-text-field>

      <p>帮我取服务</p>
      <v-radio-group v-model="formData.take_service" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>
      <v-text-field v-model="formData.init_take_time" type="number" label="帮我取初始接单时间" ></v-text-field>

      <p>帮我买服务</p>
      <v-radio-group v-model="formData.buy_service" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>
      <v-text-field v-model="formData.buy_meter" type="number" label="帮我买就近多少公里" ></v-text-field>
      <v-text-field v-model="formData.init_buy_time" type="number" label="帮我买初始接单时间" ></v-text-field>

      <p>代驾服务</p>
      <v-radio-group v-model="formData.drive_service" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>
      <v-text-field v-model="formData.init_drive_time" type="number" label="代驾初始接单时间" ></v-text-field>
      
      <v-btn class="mt-3 dark" :loading="tload" @click="submit()">保存</v-btn>
    </v-form>
  </v-container>
</template>

<script>
let _this ;
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
        open_agent: 0,
        cross_city_service:1,
        send_service:1,
        take_service:1,
        buy_service:1,
        drive_service:1,
        buy_meter:3,
        init_send_time: 15,
        init_take_time: 15,
        init_buy_time:15,
        init_drive_time: 5
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
          config_key: "service"
        },
        function(res) {
          _this.tload = false;
          if (res.errno == 0) {
            if (res.data.config_content) {
                _this.formData = JSON.parse(res.data.config_content);
            }
          }
        }
      )
    },
    submit() {
      this.tload = true;
      this.$post(
        "config/update",
        {
          config_key: "service",
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
}
</script>
