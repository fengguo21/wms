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
    <div class="sort-top">
        <el-form ref="formData" class="form_wrap clearfix" :model="formData" label-width="120px">
            <el-col :span="6">
                <el-form-item label="货主类型">
                    <el-select style="width: 100%" v-model="formData.type" @change="selectChange" placeholder="请选择货主类型">
                        <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="货主名称">
                    <el-input v-model="formData.name" placeholder="货主名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="货主简称">
                    <el-input v-model="formData.shortName" placeholder="货主简称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="联系人">
                    <el-input v-model="formData.contactName" placeholder="联系人"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="联系手机">
                    <el-input v-model="formData.contactPhone" placeholder="联系手机"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="联系电话">
                    <el-input v-model="formData.contactTel" placeholder="联系电话"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="详细地址">
                    <el-input v-model="formData.address" placeholder="详细地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align:center; margin-bottom: 10px;">
                <el-button size="small" type="primary" @click="onSubmit('formData')" icon="search">查询</el-button>
                <el-button size="small" type="primary" @click="resetForm" icon="circle-close">清空</el-button>
                <!--<el-button size="small" type="primary" @click="add" icon="plus">新增</el-button>-->
            </el-col>
        </el-form>
        <!-- 模态框 -->
        <el-dialog style="text-align:center" :title="dialogVisible.title" v-model="dialogVisible.dialog">
            <addEnterprise :formData="newFormData" v-if="dialogVisible.dialog" v-on:showChange="showChange"></addEnterprise>
        </el-dialog>
    </div>
</template>
<script>
let sel = [{value: 0,label: '其他'}, 
			{value: 1,label: '合作社'},
			{value: 2,label: '药商'}, 
			{value: 3,label: '药厂'},
			{value: 4,label: '个体户'}, 
			{value: 5,label: '药店'},
			{value: 6,label: '医院'}, 
			{value: 7,label: '贸易公司'},
			{value: 8,label: '零售商行'}, 
			{value: 9,label: '药农'},
			
			{value: 10,label: '介绍人'}, 
			{value: 11,label: '药贩子'},
			{value: 12,label: '产地药商'},
			{value: 13,label: '销地药商'}, 
			{value: 14,label: '药农'},
			{value: 15,label: '药农'}, 
			{value: 16,label: '诊所'},
			{value: 17,label: '化工厂'},
			{value: 18,label: '化妆品厂'}, 
			{value: 19,label: '提取物厂'},
			
			{value: 20,label: '食品厂'}, 
			{value: 21,label: '实验室'},
			{value: 22,label: '网上电商'},
			{value: 23,label: '中成药生产商'}, 
			{value: 24,label: '西药生产商'},
			{value: 25,label: '饮片厂'}, 
			{value: 26,label: '花茶厂'},
			{value: 27,label: '种植基地'},
]
import addEnterprise from './addEnterprise.vue'
import httpService from '../../common/httpService'
import {
    addressLinkage
} from '../../filters/index.js';
let selectAddress = addressLinkage();
console.log(selectAddress);
export default {
    name: 'searchHeader',
    data() {
        return {
            addresOptions: selectAddress,
            options: sel,
            formData: {
                name: '',
                shortName: '',
                contactName: '',
                contactPhone: '',
                contactTel: '',
                type: '',
                pageSize: 10,
                page: 1,
                address: ''
            },
            dialogVisible: {
                dialog: false,
                title: ''
            },
            newFormData: {
                name: '',
                shortName: '',
                contactName: '',
                contactPhone: '',
                contactTel: '',
                type: 0,
                street: '',
                address: '',
                country: 7,
                province: -1,
                city: -1,
                district: -1,
                imageArray: [],
                mainContact:'',
                mainPhone:'',
                tel:'',
                PCD: []
            }
        }
    },
    components: {
        addEnterprise,
    },
    methods: {
        //显示新增仓库
        add() {
            this.newFormData = {
                name: '',
                shortName: '',
                contactName: '',
                contactPhone: '',
                contactTel: '',
                type: 0,
                street: '',
                address: '',
                country: 7,
                province: -1,
                city: -1,
                district: -1,
                imageArray: [],
                mainContact:'',
                mainPhone:'',
                tel:'',
                PCD: []
            };
            this.dialogVisible.dialog = true;
            this.dialogVisible.title = '新增企业';
        },
        onSubmit() {
            this.$emit('search', this.formData);
        },
        resetForm() {
            this.formData = {
                name: '',
                shortName: '',
                contactName: '',
                contactPhone: '',
                contactTel: '',
                type: '',
                pageSize: 10,
                page: 1,
                address: ''
            };
            this.$store.dispatch('clearSearchInfoLsit');
        },
        // 父子传值控制弹框显隐 并根据值 是否获取数据
        showChange(params) {
            this.dialogVisible = params.dialog;
            // 判断是否需要重新获取数据
            if (params.isGetData) {
                this.onSubmit();
            }
        },
        selectChange() {
            this.$emit('search', this.formData);
        }
    }
}
</script>
