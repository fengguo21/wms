<!-- 编辑预入库表单 -->
<style lang="less" scoped>
.editStockInfo {
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
    <div class="editStockInfo">
        <el-form ref="formData" :rules="rules" :model="formData" label-width="110px" label-position="center">
            <div class="title clearfix">
                <h4 class="fl">基本信息</h4>
                <div class="btn_wrap fr">
                    <el-button size="small" @click="save('formData')" type="primary" icon="check">保存</el-button>
                </div>
            </div>
            <div class="clearfix">
                <!--  <el-col :span="8">
                    <el-form-item label="入库来源">
                        <el-select v-model="formData.source" placeholder="请选择">
                            <el-option label="货主入库" :value="0">
                            </el-option>
                            <el-option label="采购入库" :value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :span="6">
                    <el-form-item label="货主名称" prop="customerName">
                        <el-input disabled v-model="formData.customerName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联系人" prop="contactName">
                        <el-input disabled v-model="formData.contactName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联系方式" prop="contactPhone">
                        <el-input disabled v-model="formData.contactPhone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="仓库名称" prop="depotId">
                        <depot v-model="formData.depotName" v-on:getDepot="getDepot"></depot>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="库存类型">
                        <el-select style="width: 100%" v-model="formData.depotType" placeholder="请选择">
                            <el-option label="自营库存" value="自营库存">
                            </el-option>
                            <el-option label="联营库存" value="联营库存">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="预入库时间" prop="inTime">
                        <el-date-picker :picker-options="pickerOptions0" style="width: 100%" :clearable="false" v-model="formData.inTime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注">
                        <el-input v-model="formData.comment"></el-input>
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
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button @click="deleteResouce({'index': scope.$index, 'id':scope.row.id}, scope.row.isDel)" size="small" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="breedName" label="品名" width="160">
                    </el-table-column>
                    <el-table-column label="规格" width="260">
                        <template scope="scope">
                            <span v-if="scope.row.specAttribute[scope.row.breedName]">
                               {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="片型" width="160">
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
                    <el-table-column label="预入库数量" width="160">
                        <template scope="scope">
                            <myInput v-model="scope.row.num"></myInput>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位">
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
import myInput from '../myInput.vue';
export default {
    name: 'editStockInfo',
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loadingAdd: false,
            loading: false,
            isInput: true,
            rules: {
                customerName: [{
                    required: true,
                    message: '货主不能为空',
                    trigger: 'blur,change'
                }],
                contactName: [{
                    required: true,
                    message: '联系人不能为空',
                    trigger: 'blur,change'
                }],
                contactPhone: [{
                    required: true,
                    pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
                    message: '请输入合法的手机号',
                    trigger: 'blur,change'
                }],
                depotId: [{
                    required: true,
                    type: 'number',
                    message: '仓库不能为空',
                    trigger: 'blur,change'
                }],
                inTime: [{
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
        myInput,
    },
    computed: {
        formData() {
            let obj = this.$store.state.preStorage.stockInfo;
            //编辑时添加的数据
            let srcList = this.$store.state.preStorage.preNewStorageList;
            let target = [];
            for (var i = 0; i < obj.stockInItems.length; i++) {
                if (obj.stockInItems[i].numUn > 0) {
                    target.push(obj.stockInItems[i]);
                }
            };
            obj.newArr = [];
            //合并数组
            obj.newArr = target.concat(srcList);
            //处理日期时间  
            obj.inTime = new Date(obj.inTime);
            return obj;
        }
    },
    methods: {
        addRes() {
            this.$emit('clearData');
            // 获取一次仓库信息 预备库位点使用
            let depotId = this.$store.state.preStorage.stockInfo.depotId;
            if (depotId) {
                this.getSiteHttp(depotId)
            } else {
                this.$message({
                    type: 'error',
                    message: '未找到仓库'
                });
            }
        },
        //删除资源
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
                        biz_module: 'wmsStockInService',
                        biz_method: 'deleteStockInBeforehandItem',
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
                        //重新获取资源数据
                        _self.getStockInfo(_self.formData.id).then(() => {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        })
                    }, () => {});

                } else {
                    _self.$store.dispatch('pre_InStorNewDeleteResList', params.index).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    });
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        save(formName) {
            let _self = this;
            for (var i = 0; i < _self.formData.newArr.length; i++) {
                let obj = _self.formData.newArr[i];
                obj.num = Number(obj.num);
                if (obj.num <= 0) {
                    this.$message({
                        type: 'info',
                        message: '资源数量不能少于0,请编辑合适的数量'
                    });
                    return;
                }
            };
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理请求传参                   
                    let params = {
                        id: _self.formData.id,
                        depotType: _self.formData.depotType,
                        inTime: new Date(_self.formData.inTime).getTime(),
                        customerId: _self.formData.customerId,
                        depotId: _self.formData.depotId,
                        source: _self.formData.source,
                        comment: _self.formData.comment,
                        stockInItems: _self.formData.newArr
                    };
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'updateStockInBeforehand',
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
                    _self.loading = true;
                    _self.$store.dispatch('pre_updateStorageIn', obj).then(() => {
                        _self.loading = false;
                        _self.$emit('editGetHttp', {
                            id: _self.formData.id
                        })
                    }, () => {
                        _self.loading = false;
                    });

                } else {
                    return false;
                }
            });
        },
        getSiteHttp(paramsId) {
            let _self = this;
            _self.loadingAdd = true;
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                    biz_module: 'wmsDepotService',
                    biz_method: 'queryDepotById',
                    biz_param: {
                        id: paramsId //仓库ID
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
            _self.$store.dispatch('getSiteList', obj).then(() => {
                _self.loadingAdd = false;
                let obj = {
                    dialog: true,
                    showAdd: true,
                    title: '添加资源'
                }
                _self.$store.dispatch('com_changeShowDialog', obj)
            }, () => {
                _self.loadingAdd = false;
            });
        },
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
        },
        //根据ID获取详细的预入库单信息
        getStockInfo(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
                let params = {
                    id: paramsId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'queryStockInByIdBeforehand',
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
                _self.$store.dispatch('pre_getStockInfoById', obj).then(() => {
                    _self.loadingInfo = false;
                    resolve();
                }, () => {
                    _self.loadingInfo = false;
                    reject();
                });

            })
        },
    }
}
</script>
