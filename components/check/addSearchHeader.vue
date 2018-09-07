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
        <el-form class="clearfix" ref="searchData" :model="formData" label-width="120px" v-loading.body="loading">
            
            <el-col :span="6">
                <el-form-item label="盘点品种">
                    <breed style="width: 100%" v-model="formData.breedName" v-on:getBreedId="getBreedId"></breed>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="仓库">
                    <depot style="width: 100%" v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                </el-form-item>
                
            </el-col>
             <el-col :span="6">
            <el-form-item >
                   <el-button size="small" type="primary" @click="getCheckList" icon="search">查询</el-button>
                <el-button size="small" type="primary" @click="onReset" icon="circle-close">清空</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item >
                    <el-button size="small"  type="primary" @click="confirmCheck" icon="circle-check">确认生成</el-button>
                    <el-button size="small" type="danger" @click="closeDetail" icon="circle-close">取消</el-button>
                </el-form-item>
            </el-col>
           
        </el-form>
    </div>
</template>
<script>
import httpService from '../../common/httpService'
import customer from '../../components/search/customer.vue';
import breed from '../../components/search/breed.vue'
import depot from '../../components/search/depot.vue';
import site from '../../components/search/site.vue'
export default {
    name: 'searchHeader',
    data() {
        return {
            radio: 0,
            reset: '',
            loading: false,
        }
    },
    props: {
        options: {
            default: null
        },
        formData: {
            default: null
        }
    },
    components: {
        customer,
        breed,
        depot,
        site
    },
    methods: {
        confirmCheck(){
            this.$emit('confirmCheck')
        },
        getCheckList(){
            this.$emit('getCheckList')
        },
        selectValue(val) {
            this.onSubmit('search');
        },
        onSubmit(type) {
            this.formData.page = 1;
            if (this.formData.beginTime) {
                this.formData.beginTime = new Date(this.formData.beginTime).getTime();
            }
            if (this.formData.endTime) {
                this.formData.endTime = new Date(this.formData.endTime).getTime();
            }
            this.$emit('search', {
                type: type
            });
        },
        onReset() {
            this.$store.dispatch('clearSearchInfoLsit');
            this.onSubmit('clear');
        },
        getCustomer(params) {
            this.formData.customerId = params.id;
            this.formData.customerName = params.name;
            if (params.id) {
                this.onSubmit('search');
            }
        },
        getDepot(params) {
            this.formData.depotName = params.name;
            this.formData.depotId = params.id;
            if (params.id) {
                this.onSubmit('search');
            }
        },
        getBreedId(params) {
            this.formData.breedId = params.breedId;
            this.formData.breedName = params.breedName;
            if (params.breedId) {
                this.onSubmit('search');
            }
        },
        getSite(params) {
            this.formData.siteId = params.id;
            this.formData.siteName = params.name;
            if (params.id) {
                this.onSubmit('search');
            }
        },
        selectChange() {
            this.onSubmit('search');
        },

    }
}
</script>
            