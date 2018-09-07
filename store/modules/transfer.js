import httpService from '../../common/httpService'

const state = {
    endTransferList: { list: [] }, //预过户列表信息
    endTransferInfoList: { list: [] },
}

// getters
const getters = {
    endTransferList: state => state.endTransferList,
    endTransferInfoList: state => state.endTransferInfoList
}

// actions
const actions = {
        //获取指定货主下的资源信息
        end_getCustomerOriginRes({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('end_getCustomerOriginRes_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        // 获取列表数据
        end_getPreTransferList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('end_getPreTransferList_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        // 获取过户详情
        end_getTransferInfo({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('end_getTransferInfo_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        // 删除过户单
        end_deletePreTransfer({ commit, state }, param) {
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
        // 审核流程
        end_validateTransfer({ commit, state }, param) {
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

    }
    // mutations
const mutations = {
    end_getPreTransferList_my(state, res) {
        state.endTransferList = res.biz_result;
    },
    end_getTransferInfo_my(state, res) {
        state.endTransferInfoList = res.biz_result;
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}
