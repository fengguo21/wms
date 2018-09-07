import httpService from '../../common/httpService'

const state = {
    enterpriseList: { list: [] }, //货主列表 
    customerInfo: {}    
}

// getters
const getters = {
    enterpriseList: state => state.enterpriseList,
    customerInfo: state => state.customerInfo     
}

// actions
const actions = {
    getEnterpriseList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('getEnterpriseList_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    // 添加货主
    addCustomer({ commit, state }, param) {
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
    // 获取货主详情
    getCustomerInfo({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body)
                .then(function(res) {
                    commit('getCustomerInfo_my', res);
                    resolve(res);
                })
                .catch(function(err) {
                    reject(err);
                });
        })
    },
    //更新货主
    updateCustomero({ commit, state }, param) {
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
    // 删除货主
    deleteCustomer({ commit, state }, param) {
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
}

// mutations
const mutations = {
    getEnterpriseList_my(state, res) {
        state.enterpriseList = res.biz_result;
    },    
    getCustomerInfo_my(state, res) {   
    	console.log(res.biz_result)
        state.customerInfo = res.biz_result;                
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}
