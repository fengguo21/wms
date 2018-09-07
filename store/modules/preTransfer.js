import httpService from '../../common/httpService'

const state = {
    //弹框状态控制
    dialog: {
        title: '',
        dialog: false,
        showEdit: false,
        showAdd: false
    },
    ptfNewFormResList: [], //新建表单的资源列表
    ptfCustomerResList: { list: [] },//指定货主 指定仓库下的资源列表
    preTransferList: { list: [] }, //预过户列表信息
    preTransferInfo: {}, //预过详情
    preTransferInfoList: { list: [] }, //原货主下的资源详情
}

// getters
const getters = {
    preTransferList: state => state.preTransferList,
    preTransferInfo: state => state.preTransferInfo,
    preTransferInfoList: state => state.preTransferInfoList,
    preTransferEditList: state => state.preTransferEditList
}

// actions
const actions = {
    //弹框状态控制
    ptf_changDialog({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('ptf_changDialog_my', param);
            resolve();
        })
    },
    ptf_getCustomerResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('ptf_getCustomerResList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //新建表单
    ptf_newPreTransferForm({ commit, state }, param) {
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
    // 获取列表数据
    ptf_getPreTransferList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('ptf_getPreTransferList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    // 获取头部详情
    ptf_getTransferInfo({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('ptf_getTransferInfo_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //获取资源列表
    ptf_getResInfoList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('ptf_getResInfoList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    // 删除预过户单
    ptf_deletePreTransfer({ commit, state }, param) {
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
    // 删除资源条目
    ptf_deleteResItem({ commit, state }, param) {
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
    //添加资源条目
    ptf_addResItem({ commit, state }, param) {
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
    //表单资源模块的操作
    ptf_newFormAddList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('ptf_newFormAddList_my', param);
            resolve();
        })
    },
    ptf_NewFormDeleteList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('ptf_NewFormDeleteList_my', param);
            resolve();
        })
    },
    ptf_NewFormClearList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('ptf_NewFormClearList_my', param);
            resolve();
        })
    },

};

// mutations
const mutations = {
    ptf_changDialog_my(state, res) {
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
    ptf_getCustomerResList_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            let obj = res.biz_result.list[i];
            // 添加一条字段
            obj.numNow = obj.usableNum;
            obj.cmt = '';
        }
        state.ptfCustomerResList = res.biz_result;
    },
    ptf_emitData_my(state, res) {
        for (var key in res) {
            state.emitData[key] = res[key]
        }
    },
    ptf_getPreTransferList_my(state, res) {
        state.preTransferList = res.biz_result;

    },
    ptf_getTransferInfo_my(state, res) {
        state.preTransferInfo = res.biz_result;
    },
    ptf_getResInfoList_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            let obj = res.biz_result.list[i];
            // 添加一条字段
            obj.numNow = obj.numUn;
            obj.usableNum = '';
        }
        state.preTransferInfoList = res.biz_result;
    },
    ptf_newAddResList_my(state, res) {
        state.preTransferEditList.push(res);
    },
    ptf_newDeleteResList_my(state, res) {
        //循环时从 本来就有的资源列表数量基础上开始
        state.preTransferEditList.splice(res - startNum, 1);
    },
    ptf_newClearResList_my(state, res) {
        state.preTransferEditList = [];
    },
    //新建表单时候的资源
    ptf_newFormAddList_my(state, res) {
        state.ptfNewFormResList.push(res);
    },
    ptf_NewFormDeleteList_my(state, res) {
        state.ptfNewFormResList.splice(res, 1);
    },
    ptf_NewFormClearList_my(state, res) {
        state.ptfNewFormResList = [];
    },

}

export default {
    state,
    getters,
    actions,
    mutations
}
