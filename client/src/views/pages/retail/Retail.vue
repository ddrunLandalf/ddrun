<template>
  <v-container fill-height fluid>
    <v-layout justify-center align-center>
      
      <v-flex xs12>
        <material-card class="card-tabs" color="green">

          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span class="subheading font-weight-light mr-3" style="align-self: center"></span>
              <v-tab class="mr-3">分销设置</v-tab>
              <v-tab class="mr-3">指定分销用户</v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item >
              <retailset :load="true" />
            </v-tab-item>
            <v-tab-item >
              <retaillist :load="tabs == 1" />
            </v-tab-item>
            
          </v-tabs-items>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import retailset from './RetailSet'
import retaillist from './RetailUser'
export default {
  components:{
    retailset,retaillist
  },
  data() {
    return {
      tabs: 0,
      list: {
        0: false,
        1: false,
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