import httpService from '../../common/httpService'
// 公共模块 搜索列子组件
// 将所有能够通过头部搜索 组件的列表全部放这里
const state = {
    customerList: { list: [] }, //货主列表 
    breedList: { list: [] }, //品名ID
    depotList: { list: [] }, //仓库列表
    siteList: [], //仓库对应的库位点列表
    locationList: [] //地址列表
}

// getters
const getters = {
    customerList: state => state.customerList,
    breedList: state => state.breedList,
    depotList: state => state.depotList,
    siteList: state => state.siteList,
    locationList: state => state.locationList
}

// actions
const actions = {
        //获取药材产地
        getLocationList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('sch_getLocationList_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        getLocationListById({ commit, state }, param) {
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
        //获取货主列表
        getCustomerList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('sch_getCustomerList_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        //获取药品列表
        getBreedList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('sch_getBreedList_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        //获取仓库列表
        getDepotList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('sch_getDepotList_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        //获取库位点列表
        getSiteList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('sch_getSiteList_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        //清空所有列表
        clearSearchInfoLsit({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                commit('sch_clearSearchInfoLsit_my', param);
                resolve(param);
            })
        },
    }
    // mutations
const mutations = {
    sch_getLocationList_my(state, res) {
        // for (var i = 0; i < res.biz_result.list.length; i++) {
        //     let obj = res.biz_result.list[i];
        //     obj.value = obj.name;
        // }
        state.locationList = res.biz_result.list;
    },
    sch_getCustomerList_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            let obj = res.biz_result.list[i];
            obj.value = obj.name;
        }
        state.customerList = res.biz_result;
    },
    sch_getBreedList_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            let obj = res.biz_result.list[i];
            obj.value = obj.breedName;
        }
        state.breedList = res.biz_result;
    },
    sch_getDepotList_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            let obj = res.biz_result.list[i];
            obj.value = obj.name;
        }
        state.depotList = res.biz_result;
    },
    sch_getSiteList_my(state, res) {
        for (var i = 0; i < res.biz_result.depotSites.length; i++) {
            let obj = res.biz_result.depotSites[i];
            obj.value = obj.name;
        }
        state.siteList = res.biz_result.depotSites;
    },
    sch_clearSearchInfoLsit_my(state, res) {
        state.customerList = { list: [] };
        state.breedList = { list: [] };
        state.depotList = { list: [] };
        state.siteList = []
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
