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
        <el-form class="clearfix" ref="formData" :model="formData" label-width="120px" v-loading.body="loading">
            <el-col :span="4">
                <el-form-item label="盘点单号">
                    <el-input v-model="formData.batchNo" placeholder="请输入库单号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="盘点品种">
                    <breed style="width: 100%" v-model="formData.breedName" v-on:getBreedId="getBreedId"></breed>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="状态">
                    <el-select style="width: 100%" v-model="formData.status" @change="outSourcesChange" placeholder="请选择">
                        <el-option v-for="item in statuses" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            
            <el-col :span="4">
                <el-form-item label-width="120px" label="入库开始时间">
                    <el-date-picker style="width: 100%" v-model="formData.beginTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label-width="120px" label="入库结束时间">
                    <el-date-picker style="width: 100%" v-model="formData.endTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            
            <el-col :span="4">
                <el-form-item label="创建人">
                    <el-input v-model="formData.contactName" placeholder="请输入联系人"></el-input>
                </el-form-item>
            </el-col>
            
            <el-col :span="4">
                <el-form-item label="仓库">
                    <depot style="width: 100%" v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: center; margin-bottom: 10px;">
                <el-button size="small" type="primary" @click="onSubmit('search')" icon="search">查询</el-button>
                <el-button size="small" type="primary" @click="onReset" icon="circle-close">清空</el-button>
                 <el-button size="small" type="primary" @click="addRecord" >添加盘点单</el-button>
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
import config from '../../common/common.config.json'
export default {
    name: 'searchHeader',
    data() {
        return {
            radio: 0,
            reset: '',
            loading: false,
            statuses:config.auditStatus,

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
        addRecord(){
            this.$emit('addRecord')
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
