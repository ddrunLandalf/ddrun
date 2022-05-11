import api from '~/plugins/api';
interface State {
  adminNo: string;
  realName: string;
  mobileNumber: string;
  adminName: string;
}

export default {
  namespaced: true,
  state: {
    adminNo: '',
    realName: '',
    mobileNumber: '',
    adminName: ''
  } as State,
  mutations: {
    setAdminInfo(state: State, data: any) {
      state.adminNo = data.adminNo;
      state.realName = data.realName;
      state.mobileNumber = data.mobileNumber;
      state.adminName = data.adminName;
    },

    clearAdminInfo(state: State) {
      state.adminNo = '';
      state.realName = '';
      state.mobileNumber = '';
      state.adminName = '';
    },

    setAdminNo(state: State, val: string) {
      state.adminNo = val;
    }
  },
  actions: {
    async fetchUserInfo({ commit }: { commit: Function }) {
      const res = (await api.adminInfo()) as any;
      if (res.code === 200) {
        commit('setAdminInfo', res.data);
      }
    }
  }
};
