import httpService from '../../common/httpService'
// import config from '../../common/common.config.json'

const state = {
    warehouseList: { list: [] }, //库位列表
    newSiteFormList: { list: [] }, //新添加的库位点列表
    editSiteFormList: { list: [] }, //编辑时的库位点列表
    depotId: 0, //当前编辑的仓库id
    total: 0,
    stroeInfo: {}

}

// getters
const getters = {
    warehouseList: state => state.warehouseList,
    newSiteFormList: state => state.newSiteFormList,
    editSiteFormList: state => state.editSiteFormList,
    depotId: state => state.editSiteFormList,
    total: state => state.total,
    stroeInfo: state => state.stroeInfo,

}

// actions
const actions = {
    getWarehouseList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('getWarehouseList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    // 添加仓库
    newAddStorage({ commit, state }, param) {
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
    // 添加库位点
    addSite({ commit, state }, param) {
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
    // 删除库位点
    deleteDepotSite({ commit, state }, param) {
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
    deleteStorage({ commit, state }, param) {
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
    //初始化新添加时库位点列表列表
    initNewSiteFormList({ commit, state }) {
        return new Promise((resolve, reject) => {
            commit('initNewSiteFormList_my');
            resolve()
        })
    },
    // 新增时库位点表单列表
    addNewSiteFormList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('addNewSiteFormList_my', param);
            resolve()
        })
    },
    //初始化编辑时的库位点列表
    initEditSiteFormList({ commit, state }, index) {
        return new Promise((resolve, reject) => {
            commit('initEditSiteFormList', index);
            resolve()
        })
    },
    addEditSiteFormList({ commit, state }, params) {
        return new Promise((resolve, reject) => {
            commit('addEditSiteFormList_my', params);
            resolve()
        })
    },
    // 获取仓库详情
    getStoreInfo({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('getStoreInfo_my', res);
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
    getWarehouseList_my(state, res) {
        state.warehouseList.list = res.biz_result.list;
        state.total = res.biz_result.total;
    },
    //初始化新添加时库位点列表列表
    initNewSiteFormList_my(state) {
        state.newSiteFormList = { list: [] };
    },
    // 每次添加库位点时让其数组成员增加
    addNewSiteFormList_my(state, res) {
        state.newSiteFormList.list.push(res);
        console.log(state.newSiteFormList.list);
    },
    // 每次添加库位点时让其数组成员增加
    addEditSiteFormList_my(state, res) {
        state.editSiteFormList.list.push(res);
    },
    getStoreInfo_my(state, res) {
        state.stroeInfo = res.biz_result;
        state.editSiteFormList.list = res.biz_result.depotSites;
        state.depotId = res.biz_result.id;
    }


}

export default {
    state,
    getters,
    actions,
    mutations
}
