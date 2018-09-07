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
                <el-form-item label="状态">
                    <el-select style="width: 100%" v-model="formData.status" @change="outSourcesChange" placeholder="请选择">
                        <el-option v-for="item in status" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="货主信息">
                    <customer style="width: 100%" v-model="formData.customerName" v-on:getCustomer="getCustomer"></customer>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="客户名称">
                    <el-input v-model="formData.customerName" placeholder="请输入联系人"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="预出库单号">
                    <el-input v-model="formData.contactPhone" placeholder="请输入联系手机"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="供货单位">
                    <el-input v-model="formData.consigneeName" placeholder="请输入联系人名"></el-input>
                </el-form-item>
            </el-col>
            
            <el-col :span="4">
                <el-form-item label="出库类型">
                    <el-select v-model="formData.source" @change="outSourcesChange" placeholder="请选择">
                        <el-option v-for="item in outSources" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label-width="120px" label="预出库开始时间">
                    <el-date-picker style="width: 100%" v-model="formData.outTimeStart" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label-width="120px" label="预出库结束时间">
                    <el-date-picker style="width: 100%" v-model="formData.outTimeEnd" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
             <el-col :span="4">
                <el-form-item label="品名">
                    <breed style="width: 100%" v-model="formData.breedName" v-on:getBreedId="getBreedId"></breed>
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
import breed from '../../components/search/breed.vue'
export default {
    name: 'searchHeader',
    props: {
        formData: {
            default: null
        }
    },
    data() {
        return {
             status:config.status,
            depotTypes: config.depotType,
            outSources: config.outSource,
            radio: 0,
            reset: '',
            loading: false,
        }
    },
    components: {
        customer,
        depot,
        breed,
    },
    methods: {
        onSubmit(type) {
            this.formData.page = 1;
            if (this.formData.outTimeStart) {
                this.formData.outTimeStart = new Date(this.formData.outTimeStart).getTime();
            }
            if (this.formData.outTimeEnd) {
                this.formData.outTimeEnd = new Date(this.formData.outTimeEnd).getTime();
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
        newForm() {
            this.$emit('changeForm', {
                isFormShow: true
            });
        },
        outSourcesChange() {
            this.onSubmit('search');
        }
    }
}
</script>
