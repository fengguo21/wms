<!-- 编辑预过户表单 -->
<style lang="less" scoped>
.editTransferInfo {
    .title {
        padding: 10px 0;
        width: 100%;
        .fl {
            height: 36px;
            line-height: 36px;
        }
    }
}
</style>
<template>
    <div class="editTransferInfo">
        <el-form ref="formData" :rules="rules" :model="formData" label-width="110px" label-position="center">
            <div class="title clearfix">
                <h4 class="fl">基本信息</h4>
                <div class="btn_wrap fr">
                    <el-button size="small" @click="save('formData')" type="primary" icon="check">保存</el-button>
                </div>
            </div>
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
                <el-form-item label="仓库名称">
                    <depot v-model="formData.depotName" v-on:getDepot="getDepot">
                    </depot>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="预入库时间" prop="transferTime">
                    <el-date-picker :picker-options="pickerOptions0" style="width: 100%" :clearable="false" v-model="formData.transferTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="备注">
                    <el-input v-model="formData.comment"></el-input>
                </el-form-item>
            </el-col>
            <div class="title clearfix">
                <h4 class="fl">客户信息</h4>
            </div>
            <el-col :span="8">
                <el-form-item label="原货主">
                    <el-input disabled v-model="formData.contactName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人">
                    <el-input disabled v-model="formData.contactPhone"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系方式">
                    <el-input disabled v-model="formData.contactPhone"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="新货主" prop="customerNew">
                    <customer :disabled="true" style="width: 100%" v-model="formData.newName" v-on:getCustomer="getCustomerNew"></customer>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="新联系人">
                    <el-input disabled v-model="formData.contactNameNew"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="新联系方式">
                    <el-input disabled v-model="formData.contactPhoneNew"></el-input>
                </el-form-item>
            </el-col>
            <div class="title clearfix">
                <h4 class="fl">资源信息</h4>
                <div class="fr">
                    <el-button size="small" @click="add" type="primary" :loading="loadingAdd">添加资源</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <div class="table">
                <el-table align="center" max-height="400" :data="formData.list" border stripe style="width: 100%; margin: auto" :v-loading.body="loading">
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button icon="delete2" @click="deleteResouce(scope.row.id)" size="small" type="text"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="breedName" label="品名" width="120">
                    </el-table-column>
                    <el-table-column label="规格" min-width="220">
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
                    <el-table-column label="过户量" width="140">
                        <template scope="scope">
                            <myInput :stockId="scope.row.stockId" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                        </template>
                    </el-table-column>
                    <el-table-column label="资源可用量" width="140">
                        <template scope="scope">
                            <usableNum :stockId="scope.row.stockId" :data="true" v-model="scope.row.usableNum"></usableNum>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" width="120">
                        <template scope="scope">
                            {{scope.row.unitId | filterUnit}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import depot from '../../components/editSearch/depot.vue'
import customer from '../../components/editSearch/customer.vue'
import myInput from '../../components/myInput.vue'
import usableNum from '../../components/usableNum.vue'
export default {
    name: 'editStockInfo',
    props: ['loadingAdd'],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loading: false,
            rules: {
                customerNew: [{
                    required: true,
                    type: 'number',
                    message: '新货主名不能为空',
                    trigger: 'blur,change'
                }],
                depotId: [{
                    required: true,
                    type: 'number',
                    message: '仓库不能为空',
                    trigger: 'blur,change'
                }],
                transferTime: [{
                    type: 'date',
                    required: true,
                    message: '请选择日期',
                    trigger: 'blur,change'
                }]
            },
            unDisabled: -1,
        }
    },
    mounted() {
        this.unDisabled = -1;
    },
    components: {
        depot,
        customer,
        myInput,
        usableNum
    },
    computed: {
        formData() {
            //处理日期时间  
            let obj = this.$store.state.preTransfer.preTransferInfo;
            obj.transferTime = new Date(obj.transferTime);
            let target = [];
            let src = this.$store.state.preTransfer.preTransferInfoList.list;
            for (var i = 0; i < src.length; i++) {
                if (src[i].numUn > 0) {
                    target.push(src[i]);
                }
            };
            obj.list = target;
            return obj;
        }

    },
    methods: {
        add() {
            //获取该货主 指定仓库下的资源列表
            this.getResById().then(() => {
                let obj = {};
                obj.dialog = true;
                obj.showAdd = true;
                obj.title = '资源列表'
                this.$store.dispatch('ptf_changDialog', obj);
            })
        },
        save(formName) {
            let _self = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理请求数组
                    let sendList = _self.formData.list;
                    let sendItems = this.filterEditResList(sendList);
                    // 处理请求传参
                    let params = {
                        id: _self.formData.id,
                        source: _self.formData.source,
                        customerNew: _self.formData.customerNew,
                        transferTime: new Date(_self.formData.transferTime).getTime(),
                        comment: _self.formData.comment,
                        transferItems: sendItems,
                    }
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                            biz_module: 'wmsStockTransferService',
                            biz_method: 'updateTransferBeforehand',
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
                    _self.$store.dispatch('pre_addStockIn', obj).then(() => {
                        _self.$store.dispatch('ptf_changDialog', {});
                        _self.$emit('editGetHttp', {
                            id: _self.formData.id
                        });
                    });

                } else {
                    return false;
                }
            });
        },
        deleteResouce(paramsId) {
            let _self = this;
            this.$confirm('确定删除该条资源吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockTransferService',
                        biz_method: 'deleteTransferItem',
                        biz_param: {
                            itemId: paramsId
                        }
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
                _self.$store.dispatch('ptf_deleteResItem', obj).then(() => {
                    //重新获取列表数据                  
                    _self.getTransferInfoResList(_self.formData.id).then(() => {
                        _self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                }, () => {});

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        getCustomerNew(params) {
            this.formData.customerNew = params.id;
            this.formData.newName = params.name;
        },
        //处理编辑过后的资源数组
        filterEditResList(arr) {
            let newArr = []
            for (var i = 0; i < arr.length; i++) {
                let obj = {};
                obj.id = arr[i].id;
                obj.num = Number(arr[i].numNow);
                newArr.push(obj);
            }
            return newArr;
        },
        //根据ID获取详情列表
        getTransferInfoResList(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
                let params = {
                    transferId: paramsId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockTransferService',
                        biz_method: 'queryTransferItemList',
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
                _self.$store.dispatch('ptf_getResInfoList', obj).then(() => {
                    resolve();
                }, () => {
                    reject();
                });

            })
        },
        //获取货主ID下的资源信息 
        getResById() {
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
        }
    }
}
</script>
