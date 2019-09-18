<template>
  <v-container fill-height fluid>
    <v-layout justify-center align-center>
      
      <v-flex xs12>
        <material-card class="card-tabs" color="green">

          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span class="subheading font-weight-light mr-3" style="align-self: center"></span>
              <v-tab class="mr-3">小程序基础设置</v-tab>
              <v-tab class="mr-3">小程序配置</v-tab>
              <v-tab class="mr-3">微信支付配置</v-tab>
              <v-tab class="mr-3">小程序模板消息配置</v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item >
              <mwx :load="true" />
            </v-tab-item>
            <v-tab-item >
              <idkey :load="tabs == 1" />
            </v-tab-item>
            <v-tab-item >
              <mch :load="tabs == 2" />
            </v-tab-item>
            <v-tab-item >
              <templatewxapp :load="tabs == 3" />
            </v-tab-item>
            
          </v-tabs-items>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import mwx from './ConfigMwx'
import idkey from './ConfigMwxKey'
import mch from './ConfigMwxMch'
import templatewxapp from './ConfigMwxTemplate'

export default {
  components:{
    mwx,idkey,mch,templatewxapp
  },
  data() {
    return {
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false,
        3: false,
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