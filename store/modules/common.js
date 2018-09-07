// 定义的一些公共的方法与状态值 迭代时候再用
import httpService from '../../common/httpService'
import axios from '../../plugins/axios.js'
// import element from '../../plugins/element.js'
const state = {
    changNum: {
        id: '',
        num: ''
    },
    dialog: {
        dialog: false,
        title: '',
        showEdit: '',
        showAdd: ''
    },
    //物流公司列表
    logisticsList: []
};
// getters
const getters = {
    changNum: state => state.changNum
};
// actions
const actions = {
    com_getStockItemById({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'wmsStockService',
                biz_method: 'queryStockById',
                biz_param: { id: param }
            };
            //加密处理接口
            url = httpService.addSID(url);
            body.version = 1;
            body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
            body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            axios.post(url, body)
                .then(function(response) {
                    if (response.data.code === '1c01' || response.data.code === 200) {
                        resolve(response.data.biz_result);
                    } else {
                        reject(response.data);
                    }
                })
                .catch(function(error) {});
        })
    },
    com_changNum({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('com_changNum_my', param);
            resolve(param);
        })
    },
    //删除资源
    deleteResItems({ commit, state }, param) {
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
    //公共切换模态框显示隐藏
    com_changeShowDialog({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('com_changeShowDialog_my', param);
            resolve();
        })
    },
    //公共导出PDF功能
    com_exportPDF({ commit, state }, param) {
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
    //公共部分 单独获取仓库列表
    com_getDepotList({ commit, state }, param) {
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
    //公共部分 单独根据仓库 获取该仓库下的用户列表
    com_getCustomerList({ commit, state }, param) {
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
    //公共方法 获取物流公司列表
    com_getLogisticsList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            //state.logisticsList = [{ id: 1, code: "yunda", name: "韵达" }]
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    state.logisticsList = res.biz_result.list;
                    //resolve(res);
                })
                .catch(function(err) {
                    //reject(err);
                });

        })
    }
};
// mutations
const mutations = {
    com_changNum_my(state, res) {
        state.changNum = res;
    },
    com_changeShowDialog_my(state, res) {
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
}

export default {
    state,
    getters,
    actions,
    mutations
}