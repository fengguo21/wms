import httpService from '../../common/httpService'

// state
const state = {
    checkList: { list: [] },
    checkInfoList: { list: [] },
 };

// getters
const getters = {
    checkList: state => state.checkList,
    checkInfoList: state => state.checkInfoList
};

// actions
const actions = {
    //货主下的资源列表
    chk_getCheckList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('chk_getCheckList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    chk_getCheckListById({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('chk_getCheckListById_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //添加盘库记录
    chk_addCheckRecord({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //盘库记录审核操作 重新申请 结束流程 主管审核
    chk_validateHandler({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
 

};
//mutations
const mutations = {
    chk_getCheckList_my(state, res) {
        state.checkList = res.biz_result;
    },
    chk_getCheckListById_my(state, res) {
        state.checkInfoList = res.biz_result;
    }

};

export default {
    state,
    getters,
    actions,
    mutations
};
