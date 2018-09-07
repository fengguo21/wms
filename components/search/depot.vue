<!-- 仓库点ID -->
<style lang="less" scoped>
.radio_wrap {
    width: 140px;
}

.select_wrap {
    padding-left: 140px;
}
</style>
<template>
    <el-select clearable v-model="depotId" @change="changeDepot" filterable remote :remote-method="remoteMethod" placeholder="请输入仓库名">
        <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
    </el-select> 
</template>
<script>
import httpService from '../../common/httpService.js';
export default {
    name: 'depot',
    props: ['data'],
    data() {
        return {
            loading: false,
            depotId: '',
            timeout: ''
        }
    },
    computed: {
        selectData() {
            return this.$store.state.search.depotList.list;
        }
    },
    watch: {
        selectData(newVal, oldVal) {
            if (newVal.length == 0) {
                //清空输入框
                this.depotId = '';             
            }
        }       
    },
    methods: {
        remoteMethod(query) {
            if (query != '') {
                let _self = this;
                _self.loading = true;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    let _self = this;
                    let params = {
                        page: 1,
                        pageSize: 20,
                        type: '',
                        name: query,
                        address: ''
                    };
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'wmsDepotService',
                        biz_method: 'queryDepot',
                        biz_param: params
                    };
                    //加密处理接口
                    url = httpService.addSID(url);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                    body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                    let obj = {
                        body: body,
                        path: url
                    };
                    _self.$store.dispatch('getDepotList', obj).then(() => {
                        _self.loading = false;
                        _self.selectData = _self.selectData.filter(item => {
                            return item.name.indexOf(query) > -1;
                        });
                    }, () => {
                        _self.loading = false;
                    });
                }, 300);

            } else {
                this.selectData = [];
            }
        },
        changeDepot(paramsId) {
            //匹配ID 返回对象
            let src = this.$store.state.search.depotList.list;
            for (var i = 0; i < src.length; i++) {
                if (src[i].id === paramsId) {
                    this.$emit('getDepot', src[i]);
                    this.getSiteHttp(paramsId);
                    return;
                }
            }
            this.$emit('getDepot', {
                id: '',
                name: ''
            });
        },
        //获取库位点
        getSiteHttp(params) {
            this.loading = true;
            let _self = this;
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'wmsDepotService',
                biz_method: 'queryDepotById',
                biz_param: {
                    id: params
                }
            };
            //加密处理接口
            url = httpService.addSID(url);
            body.version = 1;
            body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
            body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            let obj = {
                body: body,
                path: url
            }
            _self.$store.dispatch('getSiteList', obj).then(() => {
                _self.loading = false;
            }, () => {
                _self.loading = false;
            });
        },

    }
}
</script>
