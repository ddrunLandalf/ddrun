<template>
  <v-container fill-height fluid>
    <v-layout justify-center align-center>
      
      <v-flex xs12>
        <material-card class="card-tabs" color="green">

          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span class="subheading font-weight-light mr-3" style="align-self: center"></span>
              <v-tab class="mr-3">腾讯地图配置</v-tab>
              <v-tab class="mr-3">阿里云短信配置</v-tab>
              <v-tab class="mr-3">服务设置</v-tab>
              <v-tab class="mr-3">发货时间设置</v-tab>
              <v-tab class="mr-3">配送模式设置</v-tab>
              <v-tab class="mr-3">取消订单设置</v-tab>
              <v-tab class="mr-3">提现设置</v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            
            <v-tab-item >
              <mapkey :load="true" />
            </v-tab-item>
            <v-tab-item >
              <sms :load="tabs == 1" />
            </v-tab-item>
            <v-tab-item >
              <service :load="tabs == 2" />
            </v-tab-item>
            
            <v-tab-item >
              <ctime :load="tabs == 3" />
            </v-tab-item>
            <v-tab-item >
              <sendmode :load="tabs == 4" />
            </v-tab-item>
            <v-tab-item >
              <cancelorder :load="tabs == 5" />
            </v-tab-item>
            <v-tab-item >
              <cash :load="tabs == 6" />
            </v-tab-item>
          </v-tabs-items>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>

import sms from './ConfigSms'
import service from './ConfigServiceSet'
import mapkey from './ConfigMapKey'
import ctime from './ConfigTime'
import sendmode from './ConfigSendMode'
import cancelorder from './ConfigCancelOrder'
import cash from './ConfigCash'
export default {
  components:{
    sms,service,mapkey,ctime,sendmode,cancelorder,cash
  },
  data() {
    return {
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false
      }
    };
  },
  mounted(){
  },
  methods: {
    complete(index) {
      this.list[index] = !this.list[index];
    }
  }
};
</script>