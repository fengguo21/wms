<!-- 移库单号 -->
<style lang="less" scoped>
.newPreTransferForm {
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
            padding: 5px 0;
            margin-bottom: 10px;
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
    <div class="newPreTransferForm">
        <h2 v-if="radio == 0">新建移库单</h2>
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
                            <el-button class="fr" size="small" type="primary" v-on:click="clearInfo">&nbsp;重置信息</el-button>
                        </h3>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="移库单号">
                            <el-input v-model="formData.no" placeholder="请输入移库单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货主名称" prop="customerId">
                            <customer style="width: 100%" v-model="formData.customerName" v-on:getCustomer="getCustomer"></customer>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人">
                            <el-input disabled v-model="formData.contactName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系方式">
                            <el-input disabled v-model="formData.contactPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="移库时间" prop="moveDate">
                            <el-date-picker :picker-options="pickerOptions0" style="width: 100%" v-model="formData.moveDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="移库备注">
                            <el-input v-model="formData.comment" placeholder="请输入移库备注"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <h3>仓库信息</h3>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="仓库名称" prop="depotId">
                            <depot style="width: 100%" v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="原库位" prop="oldSiteId">
                            <site style="width: 100%" v-model="formData.oldSiteId" v-on:getSite="getOldSiteId"></site>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="新库位" prop="newSiteId">
                            <site style="width: 100%" v-model="formData.newSiteId" v-on:getSite="getNewSiteId"></site>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">资源列表</h3>
                    <el-button class="fr" :disabled="formData.oldSiteId == '' || formData.depotId == '' || formData.customerId == ''" size="small" @click="addRes()" type="primary" icon="plus">添加资源</el-button>
                </div>
            </el-col>
            <el-col :span="24">
                <el-table align="center" empty-text="资源列表为空,请添加资源" max-height="400" :data="items" border stripe style="width:100% margin: auto">
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button @click="deleteResList(scope.$index)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="breedName" label="品名" width="140">
                    </el-table-column>
                    <el-table-column label="规格" min-width="200">
                        <template scope="scope">
                            <span v-if="scope.row.specAttribute[scope.row.breedName]">
                                        {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                                    </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="片型" width="140">
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
                    <el-table-column label="移库数量" width="140">
                        <template scope="scope">
                            <myInput :stockId="scope.row.id" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                        </template>
                    </el-table-column>
                    <el-table-column label="资源可用量" width="140">
                        <template scope="scope">
                            <usableNum :stockId="scope.row.id" v-model="scope.row.usableNum"></usableNum>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitId" label="单位" width="80">
                        <template scope='scope'>
                            <span>{{scope.row.unitId | filterUnit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="depotType" label="资源类型" width="120">
                        <template scope="scope">
                            <span v-if="scope.row.depotType === '自营库存'">自营资源</span>
                            <span v-if="scope.row.depotType === '联营库存'">联营资源</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </div>
        <el-dialog size="large" style="text-align:center" title="添加资源列表" v-model="dialogVisible.dialog">
            <addResource v-if="dialogVisible.dialog" v-on:addList="addList" v-on:showChange="showChange"></addResource>
        </el-dialog>
    </div>
</template>
<script>
let formData = {
    no: '',
    batchNo: '',
    customerId: '',
    customerName: '',
    contactName: '',
    contactPhone: '',
    depotId: '',
    depotName: '',
    oldSiteId: '',
    newSiteId: '',
    moveDate: '',
    comment: '',
}
import httpService from '../common/httpService.js'
import customer from './search/customer.vue'
import depot from './search/depot.vue'
import addResource from './moveStorage/addResource.vue'
import site from '../components/search/site.vue'
import myInput from '../components/myInput.vue'
import usableNum from '../components/usableNum.vue'
export default {
    name: 'newPreTransferForm',
    props: ['radio'],
    data() {
        return {
            byCustomer: false,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loading: false,
            sendIng: false,
            dialogVisible: {
                dialog: false
            },
            rules: {
                customerId: [{
                    required: true,
                    type: 'number',
                    message: '请选择货主名称',
                    trigger: 'blur,change'
                }],
                depotId: [{
                    required: true,
                    type: 'number',
                    message: '请选择移库仓库',
                    trigger: 'blur,change'
                }],
                oldSiteId: [{
                    required: true,
                    type: 'number',
                    message: '请选择原库位点',
                    trigger: 'blur,change'
                }],
                newSiteId: [{
                    required: true,
                    type: 'number',
                    message: '请选择新库位点',
                    trigger: 'blur,change'
                }],
                moveDate: [{
                    required: true,
                    type: 'date',
                    message: '请选择移库时间',
                    trigger: 'blur'
                }]
            },
            formData: formData,
            items: [],
            unDisable: -1,
        }
    },
    components: {
        depot,
        site,
        customer,
        addResource,
        myInput,
        usableNum
    },
    computed: {
        sites() {
            return this.$store.state.search.siteList;
        }
    },
    methods: {
        save(formName) {
            let _self = this;
            if (this.items.length == 0) {
                this.$message({
                    type: 'info',
                    message: '请先添加资源'
                });
                return;
            };
            // 处理资源参数
            let arr = [];
            for (var i = 0; i < this.items.length; i++) {
                let src = this.items[i];
                let obj = {};
                obj.number = Number(src.numNow);
                if (obj.number <= 0) {
                    _self.$message({
                        type: 'info',
                        message: '资源数量不能少于0,请重新编辑'
                    });
                    return;
                }
                obj.stockId = src.id;
                obj.oldSiteId = _self.formData.oldSiteId;
                obj.newSiteId = _self.formData.newSiteId;
                arr.push(obj);
            };
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理请求传参
                    let params = {
                        no: _self.formData.no,
                        customerId: _self.formData.customerId,
                        depotId: _self.formData.depotId,
                        moveDate: new Date(_self.formData.moveDate).getTime(),
                        comment: _self.formData.comment,
                        stockMoveItems: arr
                    };
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                            biz_module: 'wmsStockMoveService',
                            biz_method: 'addStockMove',
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
                    _self.sendIng = true;
                    _self.loading = true;
                    _self.$store.dispatch('mov_addMoveStorageForm', obj).then(() => {
                        this.$message({
                            type: 'success',
                            message: '创建成功'
                        });
                        _self.$emit('changeForm', {
                            isFormShow: false,
                            back: false
                        })
                        _self.sendIng = false;
                        _self.loading = false;
                    }, () => {
                        _self.sendIng = false;
                        _self.loading = false;
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
        //重置表单信息
        clearInfo() {
            this.formData = {
                no: '',
                batchNo: '',
                customerId: '',
                customerName: '',
                contactName: '',
                contactPhone: '',
                depotId: '',
                depotName: '',
                oldSiteId: '',
                newSiteId: '',
                moveDate: '',
                comment: '',
            };
            this.items = [];
            this.$store.dispatch('clearSearchInfoLsit');
        },
        addList(params) {
            this.items = params;
        },
        addRes() {
            //获取该货主Id下的资源列表 做添加资源使用
            let _self = this;
            _self.loading = true;
            this.getHttp().then(() => {
                _self.loading = false;
                _self.dialogVisible.dialog = true;
            })
        },
        deleteResList(index) {
            this.$confirm('确定删除该条资源吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.items.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
            this.formData.oldSiteId = '';
            this.formData.newSiteId = '';
        },
        showChange(params) {
            this.dialogVisible = params;
        },
        getCustomer(params) {
            this.formData.customerId = params.id;
            this.formData.customerName = params.name;
            this.formData.contactName = params.mainContact;
            this.formData.contactPhone = params.mainPhone;
        },
        //获取货主ID下的资源信息
        getHttp() {
            let _self = this;
            return new Promise((resolve, reject) => {
                //判断是否通过货主信息移库
                if (this.formData.customerId) {
                    this.byCustomer = true;
                };
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let sendParams = {
                    breedId: '',
                    depotType: '',
                    batchNo: '',
                    location: '',
                    depotId: _self.formData.depotId, //_self.formData.depotId
                    siteId: _self.formData.oldSiteId,
                    customerId: _self.formData.customerId,
                    beginTime: '',
                    societyDepotType: '社会库存',
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
                _self.$store.dispatch('mov_getMoveCustomerResList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        getOldSiteId(paramsId) {
            this.formData.oldSiteId = paramsId.id;
        },
        getNewSiteId(paramsId) {
            this.formData.newSiteId = paramsId.id;
        }


    }
}
</script>
