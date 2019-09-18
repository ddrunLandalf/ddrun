const BaseRest = require('./rest.js');

module.exports = class extends BaseRest {
  indexAction() {
    return this.display();
  }
};
