<!-- 货主名称 获取货主ID -->
<style lang="less" scoped>
</style>
<template>
    <el-select :disabled="disabled" clearable v-model="customerId" @change="changeCustomer" filterable remote :remote-method="remoteMethod" placeholder="请输入货主名">
        <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
    </el-select>
</template>
<script>
import httpService from '../../common/httpService.js';
export default {
    name: 'customer',
    props: ['disabled'],
    data() {
        return {
            loading: false,
            customerId: '',
            timeout: '',
        }
    },
    watch: {
        selectData(newVal, oldVal) {
            if (newVal.length == 0) {
                //清空输入框
                this.customerId = '';
            }
        }
    },
    computed: {
        selectData() {
            return this.$store.state.search.customerList.list;
        }
    },
    methods: {
        changeCustomer(paramsId) {
            //匹配ID 返回对象
            let src = this.$store.state.search.customerList.list
            for (var i = 0; i < src.length; i++) {
                if (src[i].id === paramsId) {
                    this.$emit('getCustomer', src[i]);
                    return;
                }
            }
            this.$emit('getCustomer', {
                name: '',
                id: ''
            });
        },
        remoteMethod(queryString) {
            this.loading = true;
            if (!queryString) {
                this.selectData = [];
                this.loading = false;
            } else {
                let _self = this;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'erpCustomerService',
                        biz_method: 'queryWmsCustomerList',
                        biz_param: {
                            name: queryString,
                            page: 1,
                            pageSize: 20
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
                    _self.$store.dispatch('getCustomerList', obj).then(() => {
                        _self.loading = false;
                    }, () => {
                        _self.selectData = [];
                        _self.loading = false;
                    });
                }, 300);
            }
        },
    }
}
</script>
