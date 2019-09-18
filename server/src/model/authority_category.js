module.exports = class extends think.Model {
    get relation() {
        return {
          authority: {
            type: think.Model.HAS_MANY,
            fKey: 'cate_id'
          }
        }
    }
}