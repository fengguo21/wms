import httpService from '../../common/httpService'

// state
const state = {
    dialog: {
        title: '',
        dialog: false,
        showEdit: false,
        showAdd: false,
        showSend: false
    },
    outStorageList: { list: [] }, //表格列表
    outStorageInfoList: { newArr: [] }, //通过ID 获取详情
    outNewAddResList: [], //编辑时的新增资源列表
    outResListByCus: { list: [] }, //获取指定货主 指定仓库下的资源列表
    outConsigneeInfo: {} //销售订单的收货信息

};

// getters
const getters = {
    outStorageList: state => state.outStorageList,
    outStorageInfoList: state => state.outStorageInfoList
};
// actions
const actions = {
    out_changDialog({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('out_changDialog_my', param);
            resolve();
        })
    },
    //获取表格列表内容
    out_getOutStorageList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('out_getOutStorageList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //根据ID获取详情列表
    out_getOutStorageInfoById({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('out_getOutStorageInfoById_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //正式出库删除
    out_deleteOutStorageById({ commit, state }, param) {
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
    //正式出库删除
    out_updateOutStorage({ commit, state }, param) {
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
    //获取指定货主 指定仓库下的资源列表
    out_getResListByCus({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('out_getResListByCus_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //编辑时 对资源的操作 
    //添加
    out_newAddResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('out_newAddResList_my', param);
            resolve();
        })
    },
    //删除 传入要删除的资源对象 遍历匹配ID 删除该条信息
    out_newDeleteResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('out_newDeleteResList_my', param);
            resolve();
        })
    },
    //清空
    out_newClearResList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('out_newClearResList_my', param);
            resolve();
        })
    },
    //审核操作
    out_validateOutStorage({ commit, state }, param) {
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
    //发货界面
    out_sendGoods({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('out_changDialog_my', param);
            resolve();
        })
    },
    //确认发货
    out_delivery({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    console.log(res);
                    resolve(res);
                })
                .catch(function(err) {
                    //reject(err);
                });
        })
    },
    //根据ID获取销售订单的收货地址
    out_getConsigneeInfo({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    if (res.code == "1c01") {
                        res.biz_result.id = param.body.biz_param.id;
                        //展示发货界面
                        commit('out_getConsigneeInfo_my', res);
                    }


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
    out_changDialog_my(state, res) {
        state.dialog = {
            title: '',
            dialog: false,
            showEdit: false,
            showAdd: false,
            showForm: false,
            showSend: false,
        };
        for (var key in res) {
            state.dialog[key] = res[key];
        }
    },
    out_getOutStorageList_my(state, res) {
        state.outStorageList = res.biz_result
    },
    out_getOutStorageInfoById_my(state, res) {
        console.log(res);
        for (var i = 0; i < res.biz_result.stockOutItems.length; i++) {
            //添加numNow字段 isDel 屏蔽删除功能 后期 后端有接口做修改
            let obj = res.biz_result.stockOutItems[i];
            obj.isDel = true;
            obj.numNow = obj.num;
            obj.usableNum = '';
        }
        state.outStorageInfoList = res.biz_result
    },
    out_getResListByCus_my(state, res) {
        for (var i = 0; i < res.biz_result.list.length; i++) {
            //添加numNow字段 剩余字段做展示 判断
            let obj = res.biz_result.list[i];
            obj.num = obj.usableNum;
            obj.numNow = obj.usableNum;
        }
        state.outResListByCus = res.biz_result
    },
    out_newAddResList_my(state, res) {
        state.outNewAddResList.push(res);
    },
    out_newDeleteResList_my(state, res) {
        let count = state.outStorageInfoList.stockOutItems.length;
        state.outNewAddResList.splice(res - count, 1);
    },
    out_newClearResList_my(state, res) {
        state.outNewAddResList = [];
    },
    out_getConsigneeInfo_my(state, res) {
        state.outConsigneeInfo = res.biz_result;

    }

};

export default {
    state,
    getters,
    actions,
    mutations
};