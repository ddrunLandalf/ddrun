<template>
  <v-container fill-height fluid>
    <v-layout justify-center align-center>
      
      <v-flex xs12>
        <material-card class="card-tabs" color="green">

          <v-flex slot="header">
            <v-tabs v-model="tabs" color="transparent" slider-color="white">
              <v-tab class="mr-3">管理员列表</v-tab>
              <v-tab class="mr-3">角色列表</v-tab>
            </v-tabs>
          </v-flex>

          <v-tabs-items v-model="tabs">
            <v-tab-item >
              <admin-list />
            </v-tab-item>
            <v-tab-item >
              <role-list :load="tabs == 1" />
            </v-tab-item>
          </v-tabs-items>

        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import adminList from './AdminList'
import roleList from './RoleList'
export default {
  components:{
    adminList,roleList
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