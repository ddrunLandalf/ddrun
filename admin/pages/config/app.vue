<template>
  <div class="home-container">
    <div class="home-page-title">小程序设置</div>
    <a-tabs default-active-key="2">
      <a-tab-pane key="2" tab="开发设置" force-render>
        <AppauthConfig />
      </a-tab-pane>
      <a-tab-pane key="4" tab="地图设置" force-render>
        <MapConfig />
      </a-tab-pane>
      <a-tab-pane key="5" tab="阿里云配置">
        <AliConfig />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AppauthConfig from '@/components/config/AppauthConfig.vue';
import MapConfig from '@/components/config/MapConfig.vue';
import AliConfig from '@/components/config/AliConfig.vue';
export default Vue.extend({
  components: {
    AppauthConfig,
    MapConfig,
    AliConfig
  },
  layout: 'global'
});
</script>
