<template>
  <div class="global-container">
    <cHeader />
    <Sidebar />
    <cMain>
      <nuxt></nuxt>
    </cMain>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import cHeader from '@/components/official/layout/Header.vue';
import Sidebar from '@/components/official/layout/Sidebar.vue';
import cMain from '@/components/official/layout/Main.vue';
export default Vue.extend({
  name: 'Global',
  components: {
    cHeader,
    Sidebar,
    cMain
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$store.dispatch('profile/fetchUserInfo');
    }
  }
});
</script>
<style lang="less" scoped>
.global-container {
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
  background-color: #f3f3f3;
  overflow: hidden;
}
</style>
