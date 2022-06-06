<template>
  <view class="container">
    <!-- 经典版 -->
    <d-classic :city="city" />
    <CouponModal v-if="coupons.length > 0" />
  </view>
</template>

<script>
import DClassic from "../../components/classic/index.vue";
import { $get, login, getProviderSync } from "../../util/request.js";
import CouponModal from "../../components/modal/CouponModal.vue";
export default {
  components: {
    DClassic,
    CouponModal,
  },
  data() {
    return {
      city: uni.getStorageSync("currentCity"),
      isLoad: false,
    };
  },
  computed: {
    coupons() {
      return this.$store.state.home.unreadCoupons;
    },
  },
  onShow() {
    if (uni.getStorageSync("userInfo")) {
      this.$store.dispatch("home/getUnreadCoupons");
    }
    if (!this.isLoad) {
      return;
    }
    const city = uni.getStorageSync("currentCity");
    const home = this.$store.state.home;
    if (home.startAddress.city && home.startAddress.city !== city) {
      this.$store.commit("home/setStartAddress", {});
    }
    if (home.endAddress.city && home.endAddress.city !== city) {
      this.$store.commit("home/setEndAddress", {});
    }
    if (this.city !== city) {
      this.getCityData(city);
    }
    this.city = city;
  },
  onShareAppMessage() {
    const obj = {
      title: "叮点跑腿",
      path: "/pages/index/index",
    };
    const share = this.$store.state.home.share;
    if (share.title) {
      obj.title = share.title;
    }
    if (share.desc) {
      obj.desc = share.desc;
    }
    if (share.path) {
      obj.path = share.path;
    }
    if (share.imageUrl) {
      obj.imageUrl = share.imageUrl;
    }
    return obj;
  },
  async onLoad() {
	  
    // 是否是骑手版
    const isRiderVersion = uni.getStorageSync("userVersion") === "rider";
    if (isRiderVersion) {
      uni.redirectTo({
        url: "/pages/rider/order/order",
      });
      return;
    }
    await login();
	// const provider = uni.getStorageSync('provider');
    uni.getLocation({
      type: "gcj02",
      complete: async (res) => {
        if (res.errMsg === "getLocation:ok") {
          const result = await $get("home", {
            latitude: res.latitude,
            longitude: res.longitude,
          });
          if (result.code === 200) {
            this.city = result.data.address.city;
            uni.setStorageSync("currentCity", result.data.address.city);
            this.$store.commit("profile/setCityNo", result.data.cityNo);
            this.$store.commit("home/setWeights", result.data.weights);
            this.$store.commit("home/setTags", result.data.tags);
            this.$store.commit("home/setDefaultAddress", result.data.address);
            this.$store.commit("home/setIsOp", true);
          } else {
            this.$store.commit("home/setIsOp", false);
            this.city = result.data.cityName;
            uni.setStorageSync("currentCity", result.data.cityName);
          }
        } else if (uni.getStorageSync("currentCity")) {
          this.getCityData(uni.getStorageSync("currentCity"));
        } else {
          uni.navigateTo({
            url: "/pages/mine/address/city/city?type=home",
          });
        }
        this.isLoad = true;
      },
    });
  },
  methods: {
    async getCityData(keyword) {
      uni.showLoading();
      const result = await $get("home/city", {
        keyword,
      });
      uni.hideLoading();
      if (result.code === 200) {
        uni.setStorageSync("currentCity", result.data.cityName);
        this.$store.commit("profile/setCityNo", result.data.cityNo);
        this.$store.commit("home/setWeights", result.data.weights);
        this.$store.commit("home/setTags", result.data.tags);
        this.$store.commit("home/setIsOp", true);
      } else {
        this.$store.commit("home/setIsOp", false);
      }
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f3f3f3;
}

.container {
  .content {
    padding: 30rpx;
  }
}
</style>
