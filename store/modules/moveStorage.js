import httpService from '../../common/httpService'

// state
const state = {
    moveStorageList: { list: [] },
    moveStorageInfo: { newArr: [] },
    moveCustomerResList: { list: [] }, //货主下的资源列表
    movSiteList: [],
    movNewAddResList: []
};

// getters
const getters = {
    moveStorageList: state => state.moveStorageList,
    moveStorageInfo: state => state.moveStorageInfo,
    moveCustomerResList: state => state.moveCustomerResList,
    movSiteList: state => state.movSiteList,
    movNewAddResList: state => state.movNewAddResList
};

// actions
const actions = {
    //货主下的资源列表
    mov_getMoveCustomerResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('mov_getMoveCustomerResList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    // 获取移库列表
    mov_getMoveStorageList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('mov_getMoveStorageList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //获取仓库下的库位点列表
    mov_getSiteList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('mov_getSiteList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //编辑时 资源列表的增删操作
    mov_NewAddResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('mov_NewAddResList_my', param);
            resolve();
        })
    },
    mov_NewDelResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('mov_NewDelResList_my', param);
            resolve();
        })
    },
    mov_NewClearResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('mov_NewClearResList_my', param);
            resolve();
        })
    },
    // 通过ID 获取详情
    mov_getMoveStorageInfoById({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('mov_getMoveStorageInfoById_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //更新
    mov_upDateMoveStorageInfo({ commit, state }, param) {
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
    //删除
    mov_deleteMoveStorageItem({ commit, state }, param) {
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
    //新增
    mov_addMoveStorageForm({ commit, state }, param) {
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
    //审核操作 申请审核 主管审核 取消申请审核
    mov_validateHandle({ commit, state }, param) {
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
    mov_getMoveStorageList_my(state, res) {
        state.moveStorageList = res.biz_result;
    },
    mov_getMoveCustomerResList_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            let item = res.biz_result.list[i];
            item.numNow = item.usableNum;
            item.oldSiteId = item.siteId;
            item.newSiteId = '';
        }
        state.moveCustomerResList = res.biz_result;
    },
    mov_getSiteList_my(state, res) {
        //增加字段 新库位ID  原库位ID 方便使用
        for (var i = 0; i < res.biz_result.depotSites.length; i++) {
            let item = res.biz_result.depotSites[i];
            item.oldSiteId = item.id;
            item.newSiteId = '';
            item.label = item.name;
            item.value = item.id;
        }
        state.movSiteList = res.biz_result.depotSites;
    },
    mov_getMoveStorageInfoById_my(state, res) {
        for (var i = 0; i < res.biz_result.stockMoveItems.length; i++) {
            let obj = res.biz_result.stockMoveItems[i];
            obj.usableNum = '';
            obj.isDel = true;
        }
        res.biz_result.newArr = [];
        state.moveStorageInfo = res.biz_result;
    },
    mov_NewAddResList_my(state, res) {
        state.movNewAddResList.push(res);
    },
    mov_NewDelResList_my(state, res) {
        let staIndex = state.moveStorageInfo.stockMoveItems.length;
        state.movNewAddResList.splice(res - staIndex, 1)
        console.log(state.movNewAddResList,res,staIndex)
    },
    mov_NewClearResList_my(state, res) {
        state.movNewAddResList = [];
    },

};

export default {
    state,
    getters,
    actions,
    mutations
};
