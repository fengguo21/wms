<!-- 预过户表单 -->
<style lang="less" scoped>
.newTransferForm {
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
    <div class="newTransferForm">
        <h2 v-if="radio == 1">新建预过户单</h2>
        <h2 v-if="radio == 0">新建正式过户单</h2>
        <div class="form_wrap">
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">操作信息</h3>
                    <div class="fr">
                        <el-button :disabled="sendIng" size="small" @click="save('formData')" type="primary">立即创建</el-button>
                        <el-button size="small" icon="close" v-on:click="back">&nbsp;取消</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="form">
                <el-form ref="formData" :rules="rules" :model="formData" label-width="110px" label-position="center" v-loading.fullscreen.lock="loading">
                    <el-col :span="24">
                        <h3>
                            基本信息
                            <el-button class="fr" size="small" @click="clearInfo" type="primary">重置信息</el-button>
                        </h3>
                    </el-col>
                    <el-col :span="8" v-if="radio == 0">
                        <el-form-item label="过户单号">
                            <el-input v-model="formData.no" placeholder="请输入过户单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="过户类型">
                            <el-select style="width: 100%" v-model="formData.source" placeholder="请选择">
                                <el-option label="货主过户" :value="0">
                                </el-option>
                                <el-option label="销售过户" :value="1">
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
                        <el-form-item label="过户时间" prop="transferTime">
                            <el-date-picker :picker-options="pickerOptions0" style="width: 100%" v-model="formData.transferTime" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注信息">
                            <el-input v-model="formData.comment" placeholder="请输入备注信息"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <h3>
                           客户信息                           
                        </h3>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="原货主名" prop="customerOrigin">
                            <customer v-model="formData.customerOriginName" style="width: 100%" v-on:getCustomer="getCustomerOrigin"></customer>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人">
                            <el-input disabled v-model="formData.contactOriginName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式">
                            <el-input disabled v-model="formData.contactOriginPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="新货主名" prop="customerNew">
                            <customer v-model="formData.customerNewName" style="width: 100%" v-on:getCustomer="getCustomerNew"></customer>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人">
                            <el-input disabled v-model="formData.contactNewName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式">
                            <el-input disabled v-model="formData.contactNewPhone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">资源列表</h3>
                    <el-button class="fr" :disabled="!formData.customerOrigin || !formData.depotId" size="small" @click="add" type="primary" icon="plus">立即添加</el-button>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="table">
                    <el-table align="center" empty-text="资源列表为空,请添加资源" max-height="400" :data="transferItems" border stripe style="width: 100%">
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
                        <el-table-column label="过户数量" width="140">
                            <template scope="scope">
                                <myInput :stockId="scope.row.id" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                            </template>
                        </el-table-column>
                        <el-table-column label="资源可用量" width="120">
                            <template scope="scope">
                                <usableNum :stockId="scope.row.id" v-model="scope.row.usableNum"></usableNum>
                            </template>
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
            <el-dialog size="large" style="text-align:center" :title="dialogVisible.title" v-model="dialogVisible.dialog">
                <addResource v-if="dialogVisible.dialog" v-on:addList="addList" v-on:showChange="showChange"></addResource>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import addResource from './preTransfer/addResource.vue'
import httpService from '../common/httpService.js'
import myInput from '../components/myInput.vue'
import usableNum from '../components/usableNum.vue'
import customer from '../components/editSearch/customer.vue'
import depot from '../components/search/depot.vue'
export default {
    name: 'newTransferForm',
    props: ['radio'],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            depotList: [],
            customerList: [],
            loading: false,
            depotLodaing: false,
            sendIng: false,
            dialogVisible: {
                dialog: false,
                title: ''
            },
            rules: {
                customerOrigin: [{
                    required: true,
                    type: 'number',
                    message: '请选择原货主名',
                    trigger: 'blur,change'
                }],
                customerNew: [{
                    required: true,
                    type: 'number',
                    message: '请选择新货主名',
                    trigger: 'blur,change'
                }],
                depotId: [{
                    required: true,
                    type: 'number',
                    message: '请选择过户仓库',
                    trigger: 'blur,change'
                }],
                transferTime: [{
                    required: true,
                    type: 'date',
                    message: '请选择预过户时间',
                    trigger: 'blur,change'
                }],
            },
            formData: {
                no: '',
                source: 0,
                transferTime: '',
                depotId: '',
                depotType: '',
                depotName: '',
                customerNew: '',
                customerNewName: '',
                contactNewName: '',
                contactNewPhone: '',
                customerOrigin: '',
                customerOriginName: '',
                contactOriginName: '',
                contactOriginPhone: '',
                comment: '',
            },
            unDisabled: -1
        }
    },
    computed: {
        transferItems() {
            return this.$store.state.preTransfer.ptfNewFormResList;
        }
    },
    mounted() {
        this.$store.dispatch('ptf_NewFormClearList');
    },
    components: {
        addResource,
        myInput,
        usableNum,
        customer,
        depot
    },
    methods: {
        add(paramsId) {
            //获取该货主 指定仓库下的资源列表
            this.getHttp(paramsId).then(() => {
                this.showAdd();
            });
        },
        clearInfo() {
            this.formData = {
                no: '',
                source: 0,
                transferTime: '',
                depotId: '',
                depotType: '',
                depotName: '',
                customerNew: '',
                customerNewName: '',
                contactNewName: '',
                contactNewPhone: '',
                customerOrigin: '',
                customerOriginName: '',
                contactOriginName: '',
                contactOriginPhone: '',
                comment: '',
            };
            this.$store.dispatch('ptf_NewFormClearList');
            this.$store.dispatch('clearSearchInfoLsit');
        },
        addList(params) {
            //参数是一个数组 循环push
            for (var i = 0; i < params.length; i++) {
                this.formData.transferItems.push(params[i]);
            }
        },
        editNum(index) {
            this.unDisabled = index;
            this.transferItems[index].numNow = '';
        },
        deleteList(index) {
            this.$confirm('确定删除该条资源信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('ptf_NewFormDeleteList', index).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        // 根据radio 新建不同表单
        save(formName) {
            let _self = this;
            if (_self.transferItems.length == 0) {
                this.$message({
                    type: 'info',
                    message: '请先添加资源'
                });
                return;
            }
            // 处理入库详情数组
            let srcArr = _self.transferItems;
            let arr = [];
            for (var i = 0; i < srcArr.length; i++) {
                let obj = {};
                obj.stockId = srcArr[i].id;
                obj.num = Number(srcArr[i].numNow);
                if (obj.num <= 0) {
                    _self.$message({
                        type: 'info',
                        message: '资源数量不能少于0'
                    });
                    return;
                };
                arr.push(obj);
            };
            if (_self.formData.customerNew === _self.formData.customerOrigin) {
                _self.$message({
                    type: 'info',
                    message: '原货主与新货主重复,请重新编辑'
                });
                return;
            };
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理请求传参
                    let params = {
                        no: _self.formData.no,
                        source: _self.formData.source,
                        transferTime: new Date(_self.formData.transferTime).getTime(),
                        depotId: _self.formData.depotId,
                        customerNew: _self.formData.customerNew,
                        customerOrigin: _self.formData.customerOrigin,
                        comment: _self.formData.comment,
                        transferItems: arr
                    }

                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let method = '';
                    if (_self.radio == 1) {
                        //新建预入库单
                        method = 'addTransferBeforehand';
                    } else if (_self.radio == 0) {
                        //新建正式入库单
                        method = 'addTransfer';
                    }
                    let body = {
                            biz_module: 'wmsStockTransferService',
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
                    _self.sendIng = true;
                    _self.$store.dispatch('ptf_newPreTransferForm', obj).then(() => {
                        this.$message({
                            type: 'success',
                            message: '创建成功'
                        });
                        _self.loading = false;
                        _self.sendIng = false;
                        _self.$emit('changeForm', {
                            isFormShow: false,
                            back: false
                        })

                    }, () => {
                        _self.loading = false;
                        _self.sendIng = false;
                    });

                } else {
                    return false;
                }
            });

        },
        back() {
            this.$emit('changeForm', {
                isFormShow: false,
                back: true
            })
        },
        showAdd() {
            this.dialogVisible = {
                dialog: true,
                title: '添加资源列表'
            }
        },
        hideAdd() {
            this.dialogVisible = {
                dialog: false,
                title: ''
            }
        },
        showChange() {
            this.hideAdd();
        },
        //获取货主ID下的资源信息
        getHttp() {
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
                    customerId: _self.formData.customerOrigin,
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
                _self.$store.dispatch('ptf_getCustomerResList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
        },
        getCustomerNew(params) {
            this.formData.customerNew = params.id;
            this.formData.customerNewName = params.name;
            this.formData.contactNewName = params.mainContact;
            this.formData.contactNewPhone = params.mainPhone;
        },
        getCustomerOrigin(params) {
            this.formData.customerOrigin = params.id;
            this.formData.customerOriginName = params.name;
            this.formData.contactOriginName = params.mainContact;
            this.formData.contactOriginPhone = params.mainPhone;
        }
    }
}
</script>
