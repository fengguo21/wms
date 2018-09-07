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
                <el-form-item label="原货主名">
                    <customer style="width: 100%" v-model="formData.customerOriginName" v-on:getCustomer="getCustomerOrigin"></customer>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="联系人">
                    <el-input v-model="formData.contactName" placeholder="请输入联系人"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="联系手机">
                    <el-input v-model="formData.contactPhone" placeholder="请输入联系手机"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="新货主名">
                    <customer style="width: 100%" v-model="formData.customerNewName" v-on:getCustomer="getCustomerNew"></customer>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="新联系人">
                    <el-input v-model="formData.contactNameNew" placeholder="请输入联系人"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="联系手机">
                    <el-input v-model="formData.contactPhoneNew" placeholder="请输入联系手机"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="过户类型">
                    <el-select v-model="formData.source" @change="sourceChange" placeholder="请选择">
                        <el-option v-for="item in transferSources" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label-width="120px" label="预过户开始时间">
                    <el-date-picker style="width: 100%" v-model="formData.timeStart" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label-width="120px" label="预过户结束时间">
                    <el-date-picker style="width: 100%" v-model="formData.timeEnd" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="仓库信息">
                    <depot style="width: 100%" v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="备注信息">
                    <el-input v-model="formData.comment" placeholder="请输入备注信息"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: center; margin-bottom: 10px;">
                <el-button size="small" type="primary" @click="onSubmit('search')" icon="search">查询</el-button>
                <el-button size="small" type="primary" @click="onReset" icon="circle-close">清空</el-button>
                <el-button size="small" type="primary" @click="newForm" icon="plus">新建</el-button>
            </el-col>
        </el-form>
    </div>
</template>
<script>
import config from '../../common/common.config.json'
import httpService from '../../common/httpService'
import customer from '../../components/search/customer.vue';
import depot from '../../components/search/depot.vue';
export default {
    name: 'searchHeader',
    props: {
        formData: {
            default: null
        }
    },
    data() {
        return {
            transferSources: config.transferSource,
            reset: '',
            loading: false
        }
    },
    components: {
        customer,
        depot,
    },
    methods: {
        onSubmit(type) {
            this.formData.page = 1;
            if (this.formData.timeStart) {
                this.formData.timeStart = new Date(this.formData.timeStart).getTime();
            }
            if (this.formData.timeEnd) {
                this.formData.timeEnd = new Date(this.formData.timeEnd).getTime();
            }
            this.$emit('search', {
                type: type
            });
        },
        onReset() {
            this.$store.dispatch('clearSearchInfoLsit');
            this.onSubmit('clear');
        },
        getCustomerOrigin(params) {
            this.formData.customerOrigin = params.id;
            this.formData.customerOriginName = params.name;
            if (params.id) {
                this.onSubmit('search');
            }
        },
        getCustomerNew(params) {
            this.formData.customerNew = params.id;
            this.formData.customerNewName = params.name;
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
        newForm() {
            this.$emit('changeForm', {
                isFormShow: true
            });
        },
        sourceChange() {
            this.onSubmit('search');
        },
        depotTypeChange() {
            this.onSubmit('search');
        }
    }
}
</script>
