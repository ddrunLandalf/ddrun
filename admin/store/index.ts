import Vuex from 'vuex';
import Vue from 'vue';
import profile from './modules/profile';
import subscribe from './modules/subscribe';
Vue.use(Vuex);
interface IndexState {
  tempData: any;
  beginDate: string;
  endDate: string;
}
export default () => {
  // eslint-disable-next-line import/no-named-as-default-member
  return new Vuex.Store({
    state: {
      tempData: null as any,
      beginDate: '',
      endDate: ''
    } as IndexState,
    mutations: {
      setTempData(state: IndexState, val: any) {
        state.tempData = val;
      },
      setBeginDate(state: IndexState, val) {
        state.beginDate = val;
      },
      setEndDate(state: IndexState, val) {
        state.endDate = val;
      }
    },
    actions: {},
    modules: {
      profile,
      subscribe
    }
  });
};
