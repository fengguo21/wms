import httpService from '../../common/httpService'
// import config from '../../common/common.config.json'

const state = {
    det_storeList: { list: [] }
}

// getters
const getters = {
    storeList: state => state.storeList
}

// actions
const actions = {
    det_getStoreList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('det_getStoreList_my', res);
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
    det_getStoreList_my(state, res) {
        state.det_storeList = res.biz_result;
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}
