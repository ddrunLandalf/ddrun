<template>
  <v-footer
    id="core-footer"
    absolute
    height="82"
  >
    <div class="footer-items">
      <span
        v-for="link in links"
        :key="link.name"
      >
        <a
          :href="link.Link"
          class="tertiary--text footer-links">{{ link.name }}</a>
      </span>
    </div>
    <v-spacer/>
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      湖州叮点网络科技有限公司
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: '首页', Link: '/dashboard' },
      { name: '操作文档', Link: '/dashboard' }
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
