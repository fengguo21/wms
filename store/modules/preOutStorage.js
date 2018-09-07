import httpService from '../../common/httpService'

// state
const state = {
    dialog: {
        title: '',
        dialog: false,
        showEdit: false,
        showAdd: false,
    },
    outAddResList: { list: [] }, //指定ID 仓库下的资源列表
    putNewAddResList: [], //资源 新建与添加同步 做避免重复添加资源处理
    putOutStoList: { list: [] },
    putTableInfoList: {
        newArr: []
    } //根据ID 获取表格详情列表

};

// getters
const getters = {
    preOutStoList: state => state.preOutStoList,
    outAddResList: state => state.outAddResList,
    putNewAddResList: state => state.putNewAddResList

};
// actions
const actions = {
    put_changDialog({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('put_changDialog_my', param);
            resolve();
        })
    },
    //指定货主 指定仓库下的资源列表
    put_getPreOutStoList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('put_getPreOutStoList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //清空资源列表
    put_clearOutAddResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('put_clearOutAddResList_my', res);
            resolve();
        })
    },
    //预入库表单新增
    put_addPreOutStorage({ commit, state }, param) {
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
    //编辑时 对编辑界面济源列表的操作
    put_newAddResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('put_newAddResList_my', param);
            resolve();
        })
    },
    put_newDelResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('put_newDelResList_my', param);
            resolve();
        })
    },
    //
    put_newClearResList({ commit, state }, index) {
        return new Promise((resolve, reject) => {
            commit('put_newClearResList_my', index);
            resolve();
        })
    },
    //获取表格数据
    put_getPreOutStoTabList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('put_getPreOutStoTabList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    // 预出库删除
    put_deletePreOutStorage({ commit, state }, param) {
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
    //预出库更新
    put_updateStockOutBeforehand({ commit, state }, param) {
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
    //预出库转正式出库
    put_perToOutStorage({ commit, state }, param) {
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
    //根据 ID 获取该ID 详情列表
    put_preTableInfoListById({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('put_preTableInfoListById_my', res)
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
    put_changDialog_my(state, res) {
        state.dialog = {
            title: '',
            dialog: false,
            showEdit: false,
            showAdd: false,
            showForm: false
        };
        for (var key in res) {
            state.dialog[key] = res[key];
        }
    },
    put_getPreOutStoList_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            let obj = res.biz_result.list[i];
            //新增一个字段 当前出库量 用于表格修改展示
            obj.numNow = obj.usableNum;
        }
        state.outAddResList = res.biz_result
    },
    put_clearOutAddResList_my(state, res) {
        state.outAddResList = { list: [] };
    },
    put_newAddResList_my(state, res) {
        state.putNewAddResList.push(res);
    },
    put_newDelResList_my(state, res) {
        let count = state.outAddResList.length;
        state.putNewAddResList.splice(count + res, 1);
    },
    put_newClearResList_my(state, index) {
        state.putNewAddResList = [];
    },
    put_getPreOutStoTabList_my(state, res) {
        state.putOutStoList = res.biz_result;
    },
    put_preTableInfoListById_my(state, res) {
        for (var i = 0; i < res.biz_result.stockOutItems.length; i++) {
            let obj = res.biz_result.stockOutItems[i];
            //新增当前出库量字段 表格编辑时好处理
            obj.numNow = obj.numUn;
            obj.usableNum = '';
            obj.isDel = true; //用来区分是编辑时已从后台获取的资源还时新添加的
        }
        res.biz_result.newArr = [];
        state.putTableInfoList = res.biz_result;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
