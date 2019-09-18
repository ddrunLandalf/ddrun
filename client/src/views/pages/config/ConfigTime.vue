<template>
  <v-container>
    <v-form v-loading="tload" style="max-width:600px;margin:auto">
      
      <p class="mt-4">是否开启午夜加价配送</p>
      <v-radio-group v-model="formData.open_night" :mandatory="false" row>
        <v-radio label="开启" :value="1"></v-radio>
        <v-radio label="关闭" :value="0"></v-radio>
      </v-radio-group>

      <p >选择属于午夜和凌晨的时间</p>
      <el-checkbox-group v-model="formData.nightOptons" @change="checkChange">
        <el-checkbox v-for="(item,index) in times" :key="index" :label="index">{{item.label}}</el-checkbox>
      </el-checkbox-group>
      <v-text-field v-model="formData.nightPrice" label="午夜配送加价(元)" class="mt-3"></v-text-field>
      
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
        timeOptions: [],
        nightOptons: [],
        nightPrice:0,
        open_night:0
      },
      times:[
          {label:'00:00',value:0},{label:'01:00',value:1},{label:'02:00',value:2},{label:'03:00',value:3},{label:'04:00',value:4},{label:'05:00',value:5},
          {label:'06:00',value:6},{label:'07:00',value:7},{label:'08:00',value:8},{label:'09:00',value:9},{label:'10:00',value:10},{label:'11:00',value:11},
          {label:'12:00',value:12},{label:'13:00',value:13},{label:'14:00',value:14},{label:'15:00',value:15},{label:'16:00',value:16},{label:'17:00',value:17},
          {label:'18:00',value:18},{label:'19:00',value:19},{label:'20:00',value:20},{label:'21:00',value:21},{label:'22:00',value:22},{label:'23:00',value:23},
      ],
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
          config_key: "send_time"
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
    checkChange(e){
        console.log(e)
    },
    submit() {
      this.tload = true;
      this.$post(
        "config/update",
        {
          config_key: "send_time",
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
