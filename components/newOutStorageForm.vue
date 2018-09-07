<!--  出库表单 -->
<style lang="less" scoped>
.newOutStorageForm {
    position: relative;
    margin: 10px 20px;
    padding: 0 20px;
    background-color: #fff;
    h2 {
        text-align: center;
        font-size: 20px;
        font-weight: 700;
    }
    .form_wrap {
        width: 80%;
        margin: auto;
    }
    .form {
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #FAFAFA;
        border-radius: 4px;
        h3 {
            margin-bottom: 15px;
        }
    }
    .title {
        padding: 10px;
        border: 1px solid #4DB3FF;
        background-color: #EEF8FC;
        border-radius: 4px;
        margin: 10px 0;
    }
    .table {
        margin-top: 10px;
        margin-bottom: 30px;
    }
}
</style>
<template>
    <div class="newOutStorageForm">
        <h2 v-if="beforehand == 1">新建预出库单</h2>
        <h2 v-if="beforehand == 0">新建正式出库单</h2>
        <div class="form_wrap">
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">操作信息</h3>
                    <div class="fr">
                        <el-button size="small" @click="save('formData')" type="primary">立即创建</el-button>
                        <el-button size="small" icon="close" v-on:click="back">&nbsp;取消</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="form">
                <el-form ref="formData" :rules="rules" :model="formData" label-width="110px" label-position="center" v-loading.fullscreen.lock="loading">
                    <el-col :span="24">
                        <h3>
                            基本信息
                            <el-button class="fr" size="small" type="primary" v-on:click="clearInfo">重置信息</el-button>
                        </h3>
                    </el-col>
                    <el-col :span="8" v-if="beforehand == 0">
                        <el-form-item label="出库单号">
                            <el-input v-model="formData.no" placeholder="请输入出库单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出库类型">
                            <el-select style="width: 100%" disabled v-model="formData.source" placeholder="请选择">
                                <el-option label="货主出库" :value="0">
                                </el-option>
                                <el-option label="销售出库" :value="1">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="仓库名称" prop="depotId">
                            <depot style="width: 100%" v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出库时间" prop="outTime">
                            <el-date-picker :picker-options="pickerOptions0" style="width: 100%" v-model="formData.outTime" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注信息">
                            <el-input v-model="formData.comment" placeholder="请填写备注信息"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <h3>客户信息</h3>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="货主名称" prop="customerId">
                            <customer style="width: 100%" v-model="formData.customerName" v-on:getCustomer="getCustomer"></customer>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人">
                            <el-input disabled v-model="formData.contactName" placeholder="请填写联系人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式">
                            <el-input disabled v-model="formData.contactPhone" placeholder="请填写联系方式"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="提货人" prop="consigneeName">
                            <el-input style="width: 100%" v-model="formData.consigneeName" placeholder="请填写提货人名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式" prop="consigneePhone">
                            <el-input style="width: 100%" v-model="formData.consigneePhone" placeholder="请填写提货人手机"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车号">
                            <el-input style="width: 100%" v-model="formData.plateNumber" placeholder="请填写车牌号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">资源列表</h3>
                    <el-button class="fr" :disabled="formData.customerId == '' || formData.depotId == ''" size="small" @click="addRes" type="primary" icon="plus">添加资源</el-button>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="table">
                    <el-table align="center" empty-text="资源列表为空,请添加资源" max-height="400" :data="stockOutItems" border stripe style="width:100%">
                        <el-table-column label="操作" width="80">
                            <template scope="scope">
                                <el-button size="small" @click="deleteList(scope.$index)" type="text" icon="delete2"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="breedName" label="品名" width="120">
                        </el-table-column>
                        <el-table-column label="规格" width="200">
                            <template scope="scope">
                                <span v-if="scope.row.specAttribute[scope.row.breedName]">
                                           {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                                        </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="片型" width="120">
                            <template scope="scope">
                                <span v-if="scope.row.specAttribute[scope.row.breedName]">
                                            {{scope.row.specAttribute[scope.row.breedName]['片型']}}
                                        </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="产地" width="160">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numNow" label="出库数量" width="140">
                            <template scope="scope">
                                <myInput :disabled="scope.row.usableNum <= 0 && scope.row.numNow <= 0" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                            </template>
                        </el-table-column>
                        <el-table-column prop="usableNum" label="资源可用量" width="120">
                        </el-table-column>
                        <el-table-column prop="unitId" label="单位" width="80">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="siteName" label="库位点">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-dialog size="large" style="text-align:center" title="添加资源列表" v-model="dialog.dialog">
                <addResource :type="'new'"></addResource>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import addResource from './preOutStorage/addResource.vue'
import httpService from '../common/httpService.js'
import customer from './search/customer.vue'
import depot from './search/depot.vue'
import myInput from '../components/myInput.vue'
export default {
    name: 'newOutStorageForm',
    props: ['beforehand'],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            unDisabled: -1,
            formData: {
                virtual: 1,
                source: 0,
                depotId: '',
                depotType: '',
                customerId: '',
                customerName: '',
                outTime: '',
                consigneeName: '',
                consigneePhone: '',
                contactName: '',
                contactPhone: '',
                plateNumber: '',
                stockOutItems: []
            },
            loading: false,
            rules: {
                customerId: [{
                    required: true,
                    type: 'number',
                    message: '货主名称不能为空',
                    trigger: 'blur,change'
                }],
                depotId: [{
                    required: true,
                    type: 'number',
                    message: '仓库不能为空',
                    trigger: 'blur,change'
                }],
                consigneeName: [{
                    required: true,
                    message: '提货人不能为空',
                    trigger: 'blur,change'
                }],
                consigneePhone: [{
                    required: true,
                    pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
                    message: '请输入合法的手机号',
                    trigger: 'blur'
                }],
                outTime: [{
                    required: true,
                    type: 'date',
                    message: '请选择预入库时间',
                    trigger: 'blur,change'
                }],
            },
        }
    },
    mounted() {
        this.$store.dispatch('put_newClearResList');
    },
    computed: {
        stockOutItems() {
            return this.$store.state.preOutStorage.putNewAddResList;
        },
        dialog() {
            return this.$store.state.preOutStorage.dialog;
        }
    },
    components: {
        addResource,
        depot,
        customer,
        myInput
    },
    methods: {
        addRes() {
            //获取该用户名 该仓库下的资源
            let _self = this;
            this.getHttp().then(() => {
                let obj = {
                    dialog: true
                }
                _self.$store.dispatch('put_changDialog', obj);
            })
        },
        clearInfo() {
            this.formData = {
                virtual: 1,
                source: 0,
                depotId: '',
                depotType: '',
                customerId: '',
                customerName: '',
                outTime: '',
                consigneeName: '',
                consigneePhone: '',
                contactName: '',
                contactPhone: '',
                plateNumber: '',
                stockOutItems: [],
                comment: '',
            };
            this.$store.dispatch('put_newClearResList');
            this.$store.dispatch('clearSearchInfoLsit');
        },
        //删除资源列表信息
        deleteList(index) {
            this.$confirm('确定删除该条资源吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('put_newDelResList', index).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        save(formName) {
            let _self = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (_self.stockOutItems.length == 0) {
                        this.$message({
                            type: 'info',
                            message: '请先添加资源'
                        });
                        return;
                    }
                    // 处理入库详情数组
                    let srcArr = _self.stockOutItems;
                    let arr = [];
                    for (var i = 0; i < srcArr.length; i++) {
                        let obj = {};
                        obj.breedId = srcArr[i].breedId;
                        obj.num = Number(srcArr[i].numNow);
                        if (obj.num <= 0) {
                            _self.$message({
                                type: 'info',
                                message: '资源数量不能少于0'
                            });
                            return;
                        };
                        obj.unitId = srcArr[i].unitId;
                        obj.siteId = srcArr[i].siteId;
                        obj.location = srcArr[i].location;
                        obj.stockId = srcArr[i].id;
                        arr.push(obj);
                    }
                    // 处理请求传参
                    let params = {
                        no: _self.formData.no,
                        virtual: _self.formData.virtual,
                        source: _self.formData.source,
                        depotId: _self.formData.depotId,
                        customerId: _self.formData.customerId,
                        outTime: new Date(_self.formData.outTime).getTime(),
                        beforehand: _self.beforehand, //1预出库 0 正式出库
                        consigneeName: _self.formData.consigneeName,
                        consigneePhone: _self.formData.consigneePhone,
                        comment: _self.formData.comment,
                        contactName: _self.formData.contactName,
                        contactPhone: _self.formData.contactPhone,
                        plateNumber: _self.formData.plateNumber,
                        stockOutItems: arr
                    }
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let method = '';
                    if (_self.beforehand === 1) {
                        method = 'addStockOutBeforehand';
                    } else {
                        method = 'addStockOut';
                    }
                    let body = {
                            biz_module: 'wmsStockOutService',
                            biz_method: method,
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
                    _self.loading = true;
                    _self.$store.dispatch('put_addPreOutStorage', obj).then(() => {
                        _self.loading = false;
                        this.$message({
                            type: 'success',
                            message: '创建成功'
                        });
                        _self.$emit('changeForm', {
                            isFormShow: false,
                            back: false
                        });
                    }, () => {
                        _self.loading = false;
                    });
                } else {
                    return false;
                }
            });
        },
        showChange(params) {
            this.dialogVisible = params;
        },
        back() {
            this.$emit('changeForm', {
                isFormShow: false,
                back: true
            })
        },
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
        },
        getCustomer(params) {
            this.formData.contactName = params.mainContact; //货主联系人名称
            this.formData.contactPhone = params.mainPhone //联系人手机
            this.formData.customerId = params.id;
            this.formData.customerName = params.name;
        },
        //获取指定用户ID 指定仓库下的资源
        getHttp(page) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let sendParams = {
                    breedId: '',
                    depotType: '',
                    batchNo: '',
                    location: '',
                    depotId: _self.formData.depotId, //_self.formData.depotId
                    siteId: '',
                    customerId: _self.formData.customerId,
                    beginTime: '',
                    endTime: '',
                    societyDepotType: '社会库存',
                    page: 1,
                    pageSize: 10
                };
                let body = {
                    biz_module: 'wmsStockService',
                    biz_method: 'queryStockList',
                    biz_param: sendParams
                };
                //加密处理接口
                url = httpService.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                let obj = {
                    body: body,
                    path: url
                };
                _self.$store.dispatch('put_getPreOutStoList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        editOutNum(index) {
            this.unDisabled = index;
        },
        changNum(index) {
            let obj = this.stockOutItems[index];
            if (obj.numNow > obj.usableNum) {
                obj.numNow = obj.usableNum;
                // 锁定输入框
                this.unDisabled = -1;
            }
        }

    }
}
</script>
