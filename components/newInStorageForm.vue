<!-- 预入库 入库表单 -->
<style lang="less" scoped>
.newInStorageForm {
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
    <div class="newInStorageForm">
        <h2 v-if="radio == 0">新建预入库单</h2>
        <h2 v-if="radio == 1">新建正式入库单</h2>
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
                    <el-col :span="8" v-if="radio == 1">
                        <el-form-item label="入库单号">
                            <el-input v-model="formData.no" placeholder="请输入入库单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="入库来源">
                            <el-select style="width: 100%" disabled v-model="formData.source" placeholder="请选择">
                                <el-option label="货主入库" :value="0">
                                </el-option>
                                <el-option label="采购入库" :value="1">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="库存类型">
                            <el-select style="width: 100%" v-model="formData.depotType" placeholder="请选择">
                                <el-option label="自营库存" value="自营库存">
                                </el-option>
                                <el-option label="联营库存" value="联营库存">
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
                        <el-form-item label="备注信息" label-position="right">
                            <el-input v-model="formData.comment"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="入库时间" prop="inTime">
                            <el-date-picker :picker-options="pickerOptions0" style="width: 100%" v-model="formData.inTime" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <h3>
                           客户信息                           
                        </h3>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="货主名称" prop="customerId">
                            <customer style="width: 100%" v-model="formData.name" v-on:getCustomer="getCustomer"></customer>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人">
                            <el-input disabled v-model="formData.mainContact"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式">
                            <el-input disabled v-model="formData.mainPhone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">资源列表</h3>
                    <el-button :disabled="!formData.depotId" class="fr" size="small" @click="add" type="primary" icon="plus">立即添加</el-button>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="table">
                    <el-table align="center" empty-text="资源列表为空,请添加资源" max-height="400" :data="formData.stockInItems" border stripe style="width: 100%;">
                        <el-table-column label="操作" width="80">
                            <template scope="scope">
                                <el-button size="small" @click="deleteList(scope.$index)" type="text" icon="delete2"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="breedName" label="品名" width="120">
                        </el-table-column>
                        <el-table-column label="规格" min-width="200">
                            <template scope="scope">
                                <span>
                                    {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="片型" width="120">
                            <template scope="scope">
                                <span>
                                     {{scope.row.specAttribute[scope.row.breedName]['片型']}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="产地" width="160">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="入库数量" width="160">
                            <template scope="scope">
                                <myInput v-model="scope.row.num"></myInput>
                            </template>
                        </el-table-column>
                        <el-table-column prop="unitId" label="单位" width="80">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="siteName" label="库位点" width="160">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </div>
        <el-dialog style="text-align:center" title="添加资源" v-model="dialog">
            <addResource type="new" v-if="dialog" :formData="resData" v-on:addList="addList"></addResource>
        </el-dialog>
    </div>
</template>
<script>
import addResource from './preStorage/addResource.vue'
import httpService from '../common/httpService.js'
import customer from './search/customer.vue'
import depot from './search/depot.vue'
import myInput from './myInput.vue'
export default {
    name: 'newInStorageForm',
    props: ['radio'],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loading: false,
            unDisabled: -1,
            dialog: false,
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
                inTime: [{
                    required: true,
                    type: 'date',
                    message: '请选择预入库时间',
                    trigger: 'blur,change'
                }],
            },
            formData: {
                virtual: 1,
                source: 0,
                customerId: '',
                name: '',
                depotId: '',
                depotName: '',
                depotType: '自营库存',
                inTime: '',
                comment: '',
                stockInItems: [],
            },
            resData: {
                breedId: '',
                breedName: '',
                comment: '',
                num: '',
                unitId: '',
                unitName: '',
                location: '',
                locationName: '',
                siteId: '',
                siteName: '',
                siteInfo: '',
                imageArray: [],
                gg: '',
                px: '',
                specAttribute: {}
            },
            sendIng: false
        }
    },
    components: {
        addResource,
        depot,
        customer,
        myInput
    },
    methods: {
        add() {
            this.resData = {
                breedId: '',
                breedName: '',
                comment: '',
                num: '',
                unitId: '',
                unitName: '',
                location: '',
                siteId: '',
                siteName: '',
                siteInfo: '',
                imageArray: [],
                gg: '',
                px: '',
                specAttribute: {}
            };
            this.dialog = true;
        },
        clearInfo() {
            this.formData = {
                virtual: 1,
                source: 0,
                customerId: '',
                name: '',
                depotId: '',
                depotName: '',
                depotType: '自营库存',
                inTime: '',
                comment: '',
                stockInItems: [],
            };
            this.resData = {
                breedId: '',
                breedName: '',
                comment: '',
                num: '',
                unitId: '',
                unitName: '',
                location: '',
                siteId: '',
                siteName: '',
                siteInfo: '',
                imageArray: [],
                gg: '',
                px: '',
                specAttribute: {}
            };
            this.$store.dispatch('clearSearchInfoLsit');
        },
        showChange() {
            this.dialog = false;
        },
        //删除资源列表信息
        deleteList(index) {
            this.$confirm('确定删除该条资源吗', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.formData.stockInItems.splice(index, 1);
                this.$message({
                    type: 'info',
                    message: '删除成功'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        addList(params) {
            let type = 'info';
            let msg = '已取消';
            if (params) {
                this.formData.stockInItems.push(params);
                type = 'success';
                msg = '添加成功';
            };
            this.dialog = false;
            this.$message({
                type: type,
                message: msg
            });
        },
        save(formName) {
            let _self = this;
            if (_self.formData.stockInItems.length == 0) {
                _self.$message({
                    type: 'info',
                    message: '请先添加资源'
                });
                return;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理入库详情数组
                    let arr = [];
                    let srcArr = _self.formData.stockInItems
                    for (var i = 0; i < srcArr.length; i++) {
                        let obj = {};
                        obj.breedId = srcArr[i].breedId;
                        obj.num = Number(srcArr[i].num);
                        if (obj.num <= 0) {
                            _self.$message({
                                type: 'info',
                                message: '资源数量不能少于0'
                            });
                            return;
                        }
                        obj.unitId = srcArr[i].unitId;
                        obj.siteId = srcArr[i].siteId;
                        obj.location = srcArr[i].location;
                        obj.imageArray = srcArr[i].imageArray;
                        obj.specAttribute = srcArr[i].specAttribute;
                        arr.push(obj);
                    }
                    // 处理请求传参
                    let params = {
                        no: _self.formData.no,
                        virtual: _self.formData.virtual,
                        inTime: new Date(_self.formData.inTime).getTime(),
                        customerId: _self.formData.customerId,
                        name: _self.formData.name,
                        depotId: _self.formData.depotId,
                        depotName: _self.formData.depotName,
                        depotType: _self.formData.depotType,
                        source: _self.formData.source,
                        comment: _self.formData.comment,
                        stockInItems: arr
                    }
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let method = '';
                    if (this.radio === 0) {
                        method = 'addStockInBeforehand';
                    } else {
                        method = 'addStockIn';
                    }
                    let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: method,
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
                    _self.sendIng = true;
                    _self.loading = true;
                    _self.$store.dispatch('pre_addStockIn', obj).then(() => {
                        this.$message({
                            type: 'success',
                            message: '创建成功'
                        });
                        _self.sendIng = false;
                        _self.loading = false;
                        _self.$emit('changeForm', {
                            isFormShow: false,
                            back: false
                        })
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
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
        },
        getCustomer(params) {
            this.formData.customerId = params.id;
            this.formData.name = params.name;
            this.formData.mainContact = params.mainContact;
            this.formData.mainPhone = params.mainPhone;
        },
        editNum(index) {
            this.unDisabled = index;
            this.formData.stockInItems[index].num = 0;
        },
    }
}
</script>
