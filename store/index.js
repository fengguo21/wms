import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import search from './modules/search.js'
import detail from './modules/detail'
import warehouse from './modules/warehouse'
import enterprise from './modules/enterprise'
import preStorage from './modules/preStorage'
import putInStorage from './modules/putInStorage.js'
import preTransfer from './modules/preTransfer.js'
import moveStorage from './modules/moveStorage.js'
import transfer from './modules/transfer.js'
import check from './modules/check.js'
import preOutStorage from './modules/preOutStorage.js'
import outStorage from './modules/outStorage.js'
import common from './modules/common.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        user,
        search,
        detail,
        warehouse,
        enterprise,
        preStorage,
        putInStorage,
        preTransfer,
        transfer,
        moveStorage,
        check,
        preOutStorage,
        outStorage,
        common
    }
})
