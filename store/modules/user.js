import httpService from '../../common/httpService'
const state = {
        user: { name: "", idnumber: "" },
        menus: [],
        userList: { list: [] },
        userDetail: {},
        employeeList: {}
    }
    // getters
const getters = {
    user: state => state.user,
    userList: state => state.userList,
    userDetail: state => state.userDetail,
    employeeList: state => state.employeeList
}

// actions
const actions = {
    getUserInformation({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('initUser_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    login({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(response) {                  
                    resolve(response);
                })
                .catch(function(error) {
                    reject(error);
                });
        })
    },
    initMenus({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('initMenus', param);
            resolve();
        })
    },
    getEmployee({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonGet(param)
                .then(function(response) {
                    commit('initEmployeeList_my', response);
                    resolve(response);
                })
                .catch(function(error) {
                    reject(error);
                });
        })
    }
}

// mutations
const mutations = {
    initUser_my(state, res) {
        state.user = res.biz_result;
    },
    initMenus(state, res) {
        state.menus = res;
    },
    initUserList(state, res) {
        state.userList = res.biz_result;
    },
    initUserDetail(state, res) {
        state.userDetail = state.userList.list.find((item) => item.id == res);
    },
    initEmployeeList_my(state, res) {
        state.employeeList = res.result.list;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
