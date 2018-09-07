<style lang="less" scoped>
// 头部表单
.sort-top {
    padding: 0 20px;
    border: 1px solid #20A0FF;
    background-color: #EEF8FC;
    overflow: hidden;
    margin-bottom: 10px;
    .clearfix {
        width: 100%;
        padding-top: 10px;
        margin: auto;
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .components_tips {
        padding: 5px 10px;
        background-color: #20A0FF;
        color: #fff;
    }
}
</style>
<template>
    <!-- 头部sort -->
    <div class="sort-top">
        <el-form class="clearfix"  :model="searchParam" label-width="120px" v-loading.body="loading">
           
            <el-col :span="4">
                <el-form-item label="品种搜索">
                    <el-input v-model="searchParam.breedName" placeholder="请输入品种"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="状态">
                    <el-select style="width: 100%" v-model="searchParam.state" @change="sourceChange" placeholder="请选择">
                        <el-option v-for="item in status" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item >
                    <el-button size="small" type="primary" @click="onSubmit('search')" icon="search">查询</el-button>
                <el-button size="small" type="primary" @click="onReset" icon="circle-close">清空</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="4">
            <el-form-item >
                    <el-button size="small"  type="primary" @click="stockIn" icon="circle-check">入库</el-button>
                    <el-button size="small" type="danger" @click="closeDetail" icon="circle-close">取消</el-button>
                </el-form-item>
            </el-col>
        </el-form>
    </div>
</template>
<script>
import config from '../../common/common.config.json'
import httpService from '../../common/httpService'
import customer from '../../components/search/customer.vue'
import depot from '../../components/search/depot.vue'
export default {
    name: 'searchHeader',
    props: {
        searchParam: {
            default: null
        }
    },
    data() {
        return {
            depotTypes: config.depotType,
            sources: config.source,
            status:config.status,
            radio: 0,
            reset: '',
            loading: false
        }
    },
    components: {
        customer,
        depot,
    },
    methods: {
        stockIn(){
            this.$emit('stockIn')
        },
        closeDetail(){
            
            this.$emit('closeDetail')
        },
        onSubmit(type) {
            this.$emit('search');
        },
        onReset() {  
            this.searchParam.breedName = ''
            this.searchParam.state = ''
            this.onSubmit('search');
        },
        getCustomer(params) {
            this.formData.customerId = params.id;
            this.formData.customerName = params.name;
            if (params.id) {
                this.onSubmit('search');
            }
        },
        
        sourceChange() {
            this.onSubmit('search');
        },
        
    }
}
</script>
