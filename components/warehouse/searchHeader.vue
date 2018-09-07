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
        <el-form ref="formData" class="form_wrap clearfix" :model="formData" label-width="90px">
            <el-col :span="8">
                <el-form-item label="仓库名称">
                    <el-input v-model="formData.name" placeholder="仓库名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库性质">
                    <el-select style="width: 100%" v-model="formData.type" @change="selectChange" placeholder="请选仓库性质">
                        <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item>
                    <el-button size="small" type="primary" @click="onSubmit('formData')" icon="search">查询</el-button>
                    <el-button size="small" type="primary" @click="resetForm" icon="circle-close">清空</el-button>
                    <el-button size="small" type="primary" @click="add" icon="plus">新增</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <!-- 模态框 -->
        <el-dialog v-on:close="closeDialog" style="text-align:center" :title="dialogVisible.title" v-model="dialogVisible.dialog">
            <newStorage v-on:showChange="showChange" v-show="dialogVisible.showNewStorage"></newStorage>
            <addSiteForm v-on:showChange="showChange" v-if="dialogVisible.showAddSiteForm"></addSiteForm>
        </el-dialog>
    </div>
</template>
<script>
let sel = [{
    value: '',
    label: '全部'
}, {
    value: 0,
    label: '实体库'
}, {
    value: 1,
    label: '虚拟库'
}]
import addSiteForm from './addSiteForm.vue'
import newStorage from './newStorage'
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
                type: '',
                pageSize: 10,
                page: 1,
                address: ''
            },
            dialogVisible: {
                dialog: false,
                showNewStorage: false,
                showAddSiteForm: false,
                title: ''
            }
        }
    },
    components: {
        newStorage,
        addSiteForm,
    },
    methods: {
        //显示新增仓库
        add() {
            //初始化话 vuex 库位列表
            let _self = this;
            this.$store.dispatch('initNewSiteFormList').then(() => {
                _self.dialogVisible.title = '新增仓库';
                _self.dialogVisible.dialog = true;
                _self.dialogVisible.showNewStorage = true;
                _self.dialogVisible.showAddSiteForm = false;
            });
        },
        onSubmit() {
            this.$emit('search', this.formData);
        },
        resetForm() {
            this.formData = {
                name: '',
                type: '',
                pageSize: 10,
                page: 1,
                address: ''
            }
        },
        selectChange() {
            this.$emit('search', this.formData);
        },
        // 父子传值控制弹框显隐 并根据值 是否获取数据
        showChange(params) {
            this.dialogVisible = params.dialog;
            // 判断是否需要重新获取数据
            if (params.isGetData) {
                this.onSubmit();
            }
        },
        closeDialog() {
            this.dialogVisible = {
                dialog: false,
                showNewStorage: false,
                showAddSiteForm: false,
                title: ''
            }
        }

    }
}
</script>
