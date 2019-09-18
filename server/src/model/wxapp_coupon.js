module.exports = class extends think.Model {
    get relation() {
        return {
          coupon: think.Model.BELONG_TO,
        };
      }
};