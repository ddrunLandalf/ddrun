<template>
  <v-container fill-height fluid>
    <v-layout justify-center align-center>
      
      <v-flex xs12>
        <material-card class="card-tabs" color="green">

          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <span class="subheading font-weight-light mr-3" style="align-self: center"></span>
              <v-tab class="mr-3">微信用户列表</v-tab>
              <v-tab class="mr-3">跑男列表</v-tab>
              <v-tab class="mr-3">代驾员列表</v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item >
              <user-list :load="true" />
            </v-tab-item>
            <v-tab-item >
              <runman :load="tabs == 1" />
            </v-tab-item>
            <v-tab-item >
              <driving :load="tabs == 2" />
            </v-tab-item>
          </v-tabs-items>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import userList from './UserList'
import runman from './RunManList'
import driving from './DrivingList'
export default {
  components:{
    userList,runman,driving
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