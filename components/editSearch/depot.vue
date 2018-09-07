<!-- 仓库点ID -->
<style lang="less" scoped>
</style>
<template>
    <div>
        <el-autocomplete :disabled="disabled" style="width: 100%;" v-bind:value="value" :fetch-suggestions="handleSelectDepotAsync" placeholder="请输仓库名称" @select="handleSelectDepot">
        </el-autocomplete>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js';
export default {
    name: 'depot',
    props: ['value', 'disabled'],
    data() {
        return {
            isSelect: false,
        }
    },
    methods: {
        handleSelectDepotAsync(queryString, cb) {
            if (!queryString) {
                cb([{
                    value: '请输入仓库名',
                    name: ''
                }]);
                this.$emit('getDepot', {
                    id: '',
                    name: ''
                })
                return;
            }
            //只要改变搜索值 就让返回空给父组件
            this.$emit('getDepot', {
                id: '',
                name: ''
            })
            let _self = this;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                let _self = this;
                let params = {
                    page: 1,
                    pageSize: 20,
                    type: '',
                    name: queryString,
                    address: ''
                };
                console.log(params);
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsDepotService',
                        biz_method: 'queryDepot',
                        biz_param: params
                    }
                    //加密处理接口
                url = httpService.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);

                let obj = {
                    body: body,
                    path: url
                }
                _self.$store.dispatch('getDepotList', obj).then(() => {
                    cb(_self.$store.state.search.depotList.list);
                }, () => {
                    cb([]);
                });
            }, 300);
        },
        handleSelectDepot(val) {
            this.$emit('getDepot', val)
            this.getSiteHttp(val.id);
        },
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
                }
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
