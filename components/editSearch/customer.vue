<!-- 货主名称 获取货主ID -->
<style lang="less" scoped>
</style>
<template>
    <el-autocomplete :disabled="disabled" style="width: 100%;" v-bind:value="value" :fetch-suggestions="querySearchAsync" placeholder="请输入货主名" @select="handleSelect">
    </el-autocomplete>
</template>
<script>
import httpService from '../../common/httpService.js';
export default {
    name: 'customer',
    props: ['value', 'disabled'],
    data() {
        return {

        }
    },
    methods: {
        handleSelect(val) {
            this.$emit('getCustomer', val);
        },
        querySearchAsync(queryString, cb) {
            if (!queryString) {
                cb([{
                    value: '请输货主名称',
                    name: ''
                }]);
                this.$emit('getCustomer', {
                    id: '',
                    name: ''
                });
                return;
            };
            this.$emit('getCustomer', {
                id: '',
                name: ''
            });
            let _self = this;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsCustomerService',
                        biz_method: 'queryCustomer',
                        biz_param: {
                            name: queryString,
                            page: 1,
                            pageSize: 20
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
                _self.$store.dispatch('getCustomerList', obj).then(() => {
                    cb(_self.$store.state.search.customerList.list);
                }, () => {
                    cb([]);
                });
            }, 300);
        },

    }
}
</script>
