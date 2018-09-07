import httpService from '../../common/httpService'

const state = {
    dialog: {
        dialog: false,
        title: '',
        showEdit: '',
        showAdd: ''
    },
    preStorageList: { list: [] }, //预入库列表
    stockInfo: {}, //预入库表单详细信息
    preNewStorageList: [], //编辑时添加的资源列表
}

// getters
const getters = {
    preStorageList: state => state.preStorageList,
    stockInfo: state => state.stockInfo,
}

// actions
const actions = {
    pre_InStorchangDialog({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('pre_InStorchangDialog_my', param);
            resolve();
        })
    },
    // 获取列表数据
    pre_getStorageList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('pre_getStorageList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //获取详细预入库表单详细信息
    pre_getStockInfoById({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('pre_getStockInfo_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    deleteStock({ commit, state }, param) {
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
    // 添加入库单 预入库单 入库单
    pre_addStockIn({ commit, state }, param) {
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
    pre_updateStorageIn({ commit, state }, param) {
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
    // 删除磅差
    deletePound({ commit, state }, param) {
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
    //编辑时 对资源的操作 
    //添加
    pre_InStorNewAddResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('pre_InStorNewAddResList_my', param);
            resolve();
        })
    },
    //删除 传入要删除的资源对象 遍历匹配ID 删除该条信息
    pre_InStorNewDeleteResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('pre_InStorNewDeleteResList_my', param);
            resolve();
        })
    },
    //清空
    pre_InStorNewClearResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('pre_InStorNewClearResList_my', param);
            resolve();
        })
    },

};
// mutations
const mutations = {
    pre_InStorchangDialog_my(state, res) {
        state.dialog = {
            title: '',
            dialog: false,
            showEdit: false,
            showAdd: false,
        };
        for (var key in res) {
            state.dialog[key] = res[key];
        }
    },
    pre_getStorageList_my(state, res) {
        state.preStorageList = res.biz_result;
    },
    pre_getStockInfo_my(state, res) {
        //添加 当前要入库的字段
         for (var i = 0; i < res.biz_result.stockInItems.length; i++) {

            let obj = res.biz_result.stockInItems[i];
            //添加一个字段 等于剩余量
            obj.numNow = obj.numUn;
            obj.isDel = true;
        }
        state.stockInfo = res.biz_result;
    },
    pre_InStorNewAddResList_my(state, res) {
        state.preNewStorageList.push(res);
    },
    pre_InStorNewDeleteResList_my(state, res) {
        //循环时从 本来就有的资源列表数量基础上开始
        let startNum;
        if (state.stockInfo.stockInItems) {
            startNum = state.stockInfo.stockInItems.length;
        } else {
            startNum = 0;
        }
        state.preNewStorageList.splice(res - startNum, 1);
    },
    pre_InStorNewClearResList_my(state, res) {
        state.preNewStorageList = [];
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}
