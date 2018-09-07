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
            <div class="clearfix">
                <el-col :span="8">
                    <el-form-item label="出库类型">
                        <el-select disabled style="width: 100%;" v-model="formData.source" placeholder="请选择">
                            <el-option label="货主出货" :value="0">
                            </el-option>
                            <el-option label="销售出货" :value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="仓库名称">
                        <depot disabled v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预出库时间" prop="outTime">
                        <el-date-picker :picker-options="pickerOptions0" style="width: 100%" :clearable="false" v-model="formData.outTime" type="date" placeholder="选择日期">
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
                    <el-form-item label="货主名称">
                        <el-input disabled v-model="formData.customerName"></el-input>
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
                    <el-form-item label="提货人名称" prop="consigneeName">
                        <el-input v-model="formData.consigneeName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式" prop="consigneePhone">
                        <el-input v-model="formData.consigneePhone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车号">
                        <el-input style="width: 100%" v-model="formData.plateNumber" placeholder="请填写运输车号"></el-input>
                    </el-form-item>
                </el-col>
            </div>
            <div class="title clearfix">
                <h4 class="fl">资源信息</h4>
                <div class="fr">
                    <el-button size="small" @click="addRes" type="primary" :loading="loadingAdd">添加资源</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <div class="table">
                <el-table align="center" max-height="400" :data="formData.newArr" border stripe style="width: 100%; margin: auto" :v-loading.body="loading">
                    <el-table-column label="操作" width="70">
                        <template scope="scope">
                            <el-button @click="deleteResouce({index: scope.$index, id: scope.row.id}, scope.row.isDel)" icon="delete2" size="small" type="text"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="breedName" label="品名" width="120">
                    </el-table-column>
                    <el-table-column label="规格" min-width="200">
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
                    <el-table-column prop="numNow" label="出库数量" width="140">
                        <template scope="scope">
                            <myInput :stockId="scope.row.stockId" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                        </template>
                    </el-table-column>
                    <el-table-column label="资源可用量" width="140">
                        <template scope="scope">
                            <usableNum :stockId="scope.row.stockId" :data="true" v-model="scope.row.usableNum"></usableNum>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" width="70">
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
import depot from '../../components/editSearch/depot.vue'
import httpService from '../../common/httpService.js'
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
            unDisabled: -1,
            rules: {
                consigneeName: [{
                    required: true,
                    message: '提货人不能为空',
                    trigger: 'blur,change'
                }],
                consigneePhone: [{
                    required: true,
                    pattern: /^\d{11}$/,
                    message: '请输入合法的手机号',
                    trigger: 'blur'
                }],
                outTime: [{
                    type: 'date',
                    required: true,
                    message: '请选择日期',
                    trigger: 'blur,change'
                }]
            }
        }

    },
    components: {
        depot,
        customer,
        myInput,
        usableNum
    },
    computed: {
        formData() {
            let obj = this.$store.state.outStorage.outStorageInfoList;
            console.log(obj);
            //编辑时添加的数据
            let srcList = this.$store.state.outStorage.outNewAddResList;
            let target = obj.stockOutItems;
            obj.newArr = [];

            //合并数组
            obj.newArr = target.concat(srcList);
            //处理日期时间  
            obj.outTime = new Date(obj.outTime);
            return obj;
        },
    },
    methods: {
        addRes() {
            let _self = this;
            this.getResListByCus().then(() => {
                //切换显示
                let obj = {
                    title: '货主资源列表',
                    dialog: true,
                    showAdd: true
                };
                _self.$store.dispatch('out_changDialog', obj);
            })
        },
        save(formName) {
            let _self = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理请求数组
                    let sendList = this.formData.newArr;
                    let sendItems = this.filterEditResList(sendList);
                    // 处理请求传参
                    let params = {
                        id: _self.formData.id,
                        consigneeName: _self.formData.consigneeName,
                        consigneePhone: _self.formData.consigneePhone,
                        outTime: new Date(_self.formData.outTime).getTime(),
                        comment: _self.formData.comment,
                        stockOutItems: sendItems,
                    }
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'wmsStockOutService',
                        biz_method: 'updateStockOut',
                        biz_param: params
                    };
                    //加密处理接口
                    url = httpService.addSID(url);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                    body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                    let obj = {
                        body: body,
                        path: url
                    }
                    _self.$store.dispatch('out_updateOutStorage', obj).then(() => {
                        _self.getStockOutById(_self.formData.id).then(() => {
                            _self.$store.dispatch('out_changDialog', {}).then(() => {
                                _self.$message({
                                    type: 'success',
                                    message: '修改成功'
                                });
                            });
                        })
                    }, () => {});
                } else {
                    return false;
                }
            });
        },
        deleteResouce(params, origion) {
            let _self = this;
            this.$confirm('确定删除该条资源吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (origion != undefined && origion) {
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'wmsStockOutService',
                        biz_method: 'deleteStockOutItem',
                        biz_param: {
                            itemId: params.id
                        }
                    };
                    //加密处理接口
                    url = httpService.addSID(url);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                    body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                    let obj = {
                        body: body,
                        path: url
                    }
                    _self.$store.dispatch('deleteResItems', obj).then(() => {
                        //重新获取数据
                        _self.getStockOutById(_self.formData.id).then(() => {
                            _self.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                        })
                    }, () => {});

                } else {
                    _self.$store.dispatch('out_newDeleteResList', params.index).then(() => {
                        _self.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    })
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        getCustomerNew(params) {
            this.formData.customerNew = params.id;
            this.formData.newName = params.name;
        },
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
        },
        //处理编辑过后的资源数组
        filterEditResList(arr) {
            //原来的资源
            let oldRes = this.$store.state.outStorage.outStorageInfoList.stockOutItems;
            //新增的资源
            let newRes = this.$store.state.outStorage.outNewAddResList;
            let newArr = []
            for (var i = 0; i < oldRes.length; i++) {
                let obj = {};
                obj.id = oldRes[i].id;
                obj.stockId = oldRes[i].stockId;
                obj.num = Number(oldRes[i].numNow);
                newArr.push(obj);
            }
            for (var i = 0; i < newRes.length; i++) {
                let obj = {};

                obj.stockId = newRes[i].id;
                obj.num = Number(newRes[i].numNow);
                newArr.push(obj);
            }
            return newArr;
        },
        //根据ID获取详情列表
        getStockOutById(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
                let params = {
                    id: paramsId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'queryStockOutById',
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
                _self.$store.dispatch('out_getOutStorageInfoById', obj).then(() => {
                    resolve();
                }, () => {
                    reject();
                });

            })
        },
        //获取指定货主 指定仓库下的资源列表
        getResListByCus() {
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
                _self.$store.dispatch('out_getResListByCus', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },

    }
}
</script>