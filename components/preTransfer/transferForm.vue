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
    }
}
</style>
<template>
    <div class="newTransferForm">
        <h2>正式过户单</h2>
        <div class="form_wrap">
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">操作信息</h3>
                    <div class="fr">
                        <el-button :disabled="sendIng" size="small" @click="save('formData')" type="primary">正式过户</el-button>
                        <el-button size="small" icon="close" v-on:click="back">&nbsp;取消</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="form">
                <el-form ref="formData" :rules="rules" :model="formData" label-width="110px" label-position="center" v-loading.fullscreen.lock="loading">
                    <el-col :span="24">
                        <h3>基本信息</h3>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="过户单号">
                            <el-input disabled v-model="formData.no"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="仓库名称" prop="depotId">
                            <depot :disabled="true" style="width: 100%" v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="过户类型">
                            <el-select style="width: 100%" disabled v-model="formData.source" placeholder="请选择">
                                <el-option label="货主过户" :value="0">
                                </el-option>
                                <el-option label="销售过户" :value="1">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="备注信息">
                            <el-input v-model="formData.comment" placeholder="请输入备注信息"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="过户时间" prop="transferTime">
                            <el-date-picker :picker-options="pickerOptions0" style="width: 100%" v-model="formData.transferTime" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <h3>客户信息</h3>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="原货主名" prop="customerOrigin">
                            <customer :disabled="true" style="width: 100%" v-model="formData.originName" v-on:getCustomer="getCustomerOrigin"></customer>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人">
                            <el-input disabled v-model="formData.contactName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式">
                            <el-input disabled v-model="formData.contactPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="新货主名" prop="customerNew">
                            <customer style="width: 100%" v-model="formData.newName" v-on:getCustomer="getCustomerNew"></customer>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人">
                            <el-input disabled v-model="formData.contactNameNew"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式">
                            <el-input disabled v-model="formData.contactPhoneNew"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <!--    <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">资源列表</h3>
                    <el-button class="fr" :disabled="!formData.customerOrigin || !formData.depotId" size="small" @click="add" type="primary" icon="plus">立即添加</el-button>
                </div>
            </el-col> -->
            <el-col :span="24">
                <div class="table">
                    <el-table align="center" empty-text="资源列表为空,请添加资源" max-height="400" :data="formData.resItems" border stripe style="width: 100%">
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
                        <el-table-column label="产地" width="120">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="过户数量" width="140">
                            <template scope="scope">
                                <myInput :stockId="scope.row.stockId" :maxNum="scope.row.numUn" v-model="scope.row.num"></myInput>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numUn" label="剩余数量" width="100">
                        </el-table-column>
                        <el-table-column prop="usableNum" label="资源可用量" width="140">
                            <template scope="scope">
                                <usableNum :stockId="scope.row.stockId" :data="true" v-model="scope.row.usableNum"></usableNum>
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
        </div>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import customer from '../../components/editSearch/customer.vue'
import depot from '../../components/editSearch/depot.vue'
import myInput from '../../components/myInput.vue'
import usableNum from '../../components/usableNum.vue'
export default {
    name: 'transferForm',
    props: ['formData'],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loading: false,
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
        depot,
        customer,
        myInput,
        usableNum
    },
    methods: {
        add(paramsId) {
            //获取该货主 指定仓库下的资源列表
            this.getHttp(paramsId).then(() => {
                this.showAdd();
            });
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
                this.formData.resItems.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //正式过户
        save(formName) {
            let _self = this;
            let arr = [];
            for (var i = 0; i < _self.formData.resItems.length; i++) {
                let sendObj = {};
                if (sendObj.usableNum <= 0) {
                    this.$message({
                        type: 'info',
                        message: '有资源可用数量不足,不能正式过户'
                    });
                    return;
                }
                sendObj.stockId = _self.formData.resItems[i].stockId;
                sendObj.itemId = _self.formData.resItems[i].id;
                sendObj.num = Number(_self.formData.resItems[i].num);
                if (sendObj.num <= 0) {
                    this.$message({
                        type: 'info',
                        message: '资源数量不能少于0,请重新编辑'
                    });

                    return;
                }
                if (sendObj.num > _self.formData.resItems[i].usableNum) {
                    this.$message({
                        type: 'info',
                        message: '过户数量不能大于资源可用量,请重新编辑'
                    });
                    return;
                }
                if (sendObj.num > _self.formData.resItems[i].numUn) {
                    this.$message({
                        type: 'info',
                        message: '过户数量不能大于剩余数量,请编辑'
                    });
                    return;
                }
                arr.push(sendObj);
            };
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _self = this;
                    this.$confirm('确定正式过户吗', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 处理过户详情资料                        
                        let sendData = {
                            beforehandId: _self.formData.id,
                            no: _self.formData.no,
                            comment: _self.formData.comment,
                            transferItems: arr
                        };
                        let url = httpService.urlCommon + httpService.apiUrl.most;
                        let body = {
                            biz_module: 'wmsStockTransferService',
                            biz_method: 'addTransferByBeforehand',
                            biz_param: sendData
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
                        _self.$store.dispatch('pre_addStockIn', obj).then(() => {
                            //从新获取资源信息   
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.push('/wms/home/transfer');
                        }, () => {});
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        back() {
            this.$emit('ChangeShowTransferForm', {
                showTransferForm: false,
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
            if (params.id == '') {
                this.formData.customerNew = '';
                this.formData.newName = '';
                this.formData.contactNameNew = '';
                this.formData.contactPhoneNew = '';
            } else {
                this.formData.customerNew = params.id;
                this.formData.newName = params.name;
                this.formData.contactNameNew = params.contactName;
                this.formData.contactPhoneNew = params.contactPhone;
            }
        },
        getCustomerOrigin(params) {
            if (params.id == '') {
                this.formData.customerOrigin = '';
                this.formData.originName = '';
                this.formData.contactName = '';
                this.formData.contactPhone = '';
            } else {
                this.formData.customerOrigin = params.id;
                this.formData.originName = params.name;
                this.formData.contactName = params.contactName;
                this.formData.contactPhone = params.contactPhone;
            }
        }
    }
}
</script>
