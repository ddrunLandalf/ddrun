<template>
  <v-container fill-height fluid>
    <v-layout justify-center align-center>
      
      <v-flex xs12>
        <material-card class="card-tabs" color="green">

          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span class="subheading font-weight-light mr-3" style="align-self: center"></span>
              <v-tab class="mr-3">跑男审核列表</v-tab>
              <v-tab class="mr-3">跑男审核日志</v-tab>
              <v-tab class="mr-3">提现审核</v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item >
              <vrm :load="true" />
            </v-tab-item>
            <v-tab-item >
              <log :load="tabs == 1" />
            </v-tab-item>
            <v-tab-item >
              <cash :load="tabs == 2" />
            </v-tab-item>
          </v-tabs-items>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import vrm from './VerifyRunMan'
import log from './VerifyLog'
import cash from './VerifyCash'
export default {
  components:{
    vrm,log,cash
  },
  data() {
    return {
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
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