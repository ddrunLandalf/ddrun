<template>
  <v-app>
    <div v-if="!isLogin">
      <core-filter />

      <core-toolbar />

      <core-drawer />

      <core-view />
    </div>
    <div v-if="isLogin">
      <login />
    </div>
  </v-app>
</template>

<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>

<script>
import login from './views/Login'
export default {
  components:{login},
  data () {
    return {
      isLogin : true
    }
  },
  watch: {
    $route () {
      this.init();
    }
  },
  mounted () {
    this.init();
  },
  methods:{
    init(){
      if(sessionStorage.getItem('admin_name') && this.$route.path != '/login'){
        this.isLogin = false;
      }else {
        this.$router.push({path:'/login'});
        this.isLogin = true;
      }
    },
 
  }
}
</script>