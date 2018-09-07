import httpService from '../../common/httpService'

const state = {
    dialog: {
        dialog: false,
        showEdit: false,
        showAdd: false,
        title: ''
    },
    putInStorageList: { list: [] }, //入库列表
    putNewInStorageRes: [], //编辑时添加的资源信息
    putstockInfo: {}, //入库表单详细信息

}

// getters
const getters = {
    putInStorageList: state => state.putInStorageList,
    putstockInfo: state => state.putstockInfo,
}

// actions
const actions = {
        put_InStorchangDialog({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                commit('put_InStorchangDialog_my', param);
                resolve();
            })
        },
        // 获取列表数据
        put_getInStorageList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('put_getInStorageList_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        //获取详细预入库表单详细信息
        put_getStockInfo({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                httpService.commonPost(param.path, param.body)
                    .then(function(res) {
                        commit('put_getStockInfo_my', res);
                        resolve(res);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            })
        },
        // 删除正式入库
        put_deleteStockIn({ commit, state }, param) {
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
        // 申请审核 包括申请 重新申请 主管审核 三个
        put_applyReview({ commit, state }, param) {
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
        // 取消入库
        put_cancle({ commit, state }, param) {
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
        //更新正式入库
        put_updateStorageIn({ commit, state }, param) {
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
        put_InStorNewAddResList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                commit('put_InStorNewAddResList_my', param);
                resolve();
            })
        },
        //删除 传入要删除的资源对象 遍历匹配ID 删除该条信息
        put_InStorNewDeleteResList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                commit('put_InStorNewDeleteResList_my', param);
                resolve();
            })
        },
        //清空
        put_InStorNewClearResList({ commit, state }, param) {
            return new Promise((resolve, reject) => {
                commit('put_InStorNewClearResList_my', param);
                resolve();
            })
        },
    }
    // mutations
const mutations = {
    put_InStorchangDialog_my(state, res) {
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
    put_getInStorageList_my(state, res) {
        state.putInStorageList = res.biz_result;
    },
    put_getStockInfo_my(state, res) {
        for (var i = 0; i < res.biz_result.stockInItems.length; i++) {
            let obj = res.biz_result.stockInItems[i];
            //添加字段 是否是已经有的资源 不能使用删除功能 后期增加
            obj.isDel = true;
        }
        state.putstockInfo = res.biz_result;
    },
    put_InStorNewAddResList_my(state, res) {
        state.putNewInStorageRes.push(res);
    },
    put_InStorNewDeleteResList_my(state, res) {
        //循环时从 本来就有的资源列表数量基础上开始
        let startNum = state.putstockInfo.stockInItems.length;
        state.putNewInStorageRes.splice(res - startNum, 1);
    },
    put_InStorNewClearResList_my(state, res) {
        state.putNewInStorageRes = [];
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}
