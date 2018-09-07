<style lang="less" scoped>
// 预出库管理
.outStorage {
    width: 100%; // 按鈕部份
    .btn_wrap {
        text-align: center;
    } // 表格部分
    .table {
        width: 100%;
    } // 分页部分
    .pages {
        text-align: center;
        padding-top: 5px;
        overflow: hidden;
        height: 30px;
        position: relative;
        .btn_wrap {
            position: absolute;
            left: 0;
            top: 5px;
        }
    } // 操作部分
    .handle {
        width: 100%;
        margin: auto;
        padding: 10px;
    } // 底部表格
    .table_bot {
        width: 100;
        margin: auto;
        padding-top: 10px;
        padding-bottom: 100px;
    }
}
</style>
<template>
    <div>
        <div class="outStorage" v-if="!isFormShow">
            <searchHeader v-on:search="search" :formData="formData" v-on:changeForm="changeForm"></searchHeader>
            <!-- 表格 -->
            <div class="table">
                <el-table highlight-current-row :data="tableData" v-on:row-click="getResInfoList" border stripe style="width: 100%; margin: auto" v-loading="loading">
                    <el-table-column label="操作" width="80" fixed="left">
                        <template scope="scope">
                             <el-button  v-on:row-click="getResInfoList"  type="text" size="small">详情</el-button>
                            <!--<el-button :disabled="!validate(scope.row.createrName)" @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button :disabled="!validate(scope.row.createrName)" @click="del(scope.row.id)" type="text" size="small">删除</el-button>-->
                        </template>
                    </el-table-column>
                    <el-table-column  label="状态" width="120">
                        <template scope="scope">
                                <span>{{scope.row.status | filterStockState}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column prop="createrName" label="创建人" width="120">
                    </el-table-column>
                    <el-table-column prop="comment" label="审核状态" width="150">
                        <template scope="scope">
                            <span>{{scope.row.validate,scope.row.verifierName | filterValidate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="no" label="出库单号" width="230">
                    </el-table-column>
                    <el-table-column label="出库日期" width="120">
                        <template scope="scope">
                            <span>{{scope.row.outTime | filterTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerName" label="货主名称" width="140">
                    </el-table-column>
                    <el-table-column prop="contactName" label="联系人" width="100">
                    </el-table-column>
                    <el-table-column prop="contactPhone" label="联系方式" width="140">
                    </el-table-column>
                    <el-table-column prop="consigneeName" label="提货人名称" width="120">
                    </el-table-column>
                    <el-table-column prop="consigneePhone" label="联系手机" width="140">
                    </el-table-column>
                    <el-table-column prop="depotName" label="仓库名称" width="140">
                    </el-table-column>
                    <el-table-column prop="source" label="出库经手人" min-width="120">
                      
                    </el-table-column>
                     <el-table-column prop="customerName" label="发货要求" width="120">
                    </el-table-column>
                     <el-table-column prop="customerName" label="发货备注" width="120">
                    </el-table-column>
                    <el-table-column  label="物流状态" width="160">
                     <template scope="scope">
                            <el-button  @click='viewLogistics(scope.row.id)'  type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column> 
                    <el-table-column prop="comment" label="备注" width="200">
                    </el-table-column>
                   
                </el-table>
            </div>
            <el-dialog size="large" v-on:close="dialogClose" style="text-align:center" :title="dialog.title" v-model="dialog.dialog">
                <!-- 编辑出货单 -->
                <editOutStorageInfo v-if="dialog.showEdit"></editOutStorageInfo>
                <!-- 新建出货单 -->
                <addResource v-if="dialog.showAdd"></addResource>
                <!-- 发货 -->
                <send v-if="dialog.showSend" @delivery-success="getHttp"></send>
            </el-dialog>
            <!-- 分页 -->
            <div class="pages">
                <el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <!-- 表格2 -->
            <div style="text-align: center" v-show="!loading2">
                <span>选中表格获取资源信息......</span>
            </div>
            <div class="table_bot clearfix" v-show="loading2">
                <el-col :span="24">
                    <el-table align="center" empty-text="当前资源信息未获取,或者为空" v-on:selection-change="tableSelected" max-height="400" :data="tableInfoList" border stripe  v-loading="loadingInfo">
                        
                        <el-table-column prop="breedName" label="品名" width="120">
                        </el-table-column>
                        <el-table-column label="规格" width="200">
                            <template scope="scope">
                                <span v-if="scope.row.specAttribute[scope.row.breedName]">
                               {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                            </span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="产地" width="140">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="出库量" width="90">
                        </el-table-column>
                        <el-table-column label="单位" width="70">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="siteName" label="库位">
                        </el-table-column>
                        <el-table-column prop="numEd" label="包装" width="140">
                        </el-table-column>
                        <el-table-column prop="numEd" label="件重" width="140">
                        </el-table-column>
                        <el-table-column prop="numEd" label="采购/加工日期" width="140">
                        </el-table-column>
                        <el-table-column prop="comment" label="合同供货单位" width="140">
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </div>
        <div v-if="isFormShow">
            <newOutStorageForm :beforehand="0" v-on:changeForm="changeForm"></newOutStorageForm>
        </div>
        <!-- 图片展示 -->
        <el-dialog size="tiny" style="text-align:center" title="资源图片展示" v-model="showImg">
            <resImgShow :imageArray="imageArray"></resImgShow>
        </el-dialog>
        <!--物流状态-->
        <el-dialog   title="物流状态" v-model="logisticsShow" width='800'>
            <el-steps direction="vertical"  :align-center='true' :active="1"	:space='70' >
            <block v-for='(item,index) in logisticsInfo'>
                 <el-step :title="item.time"  :description="item.context"></el-step>
            </block>
               
                
            </el-steps>
        </el-dialog>
    </div>
</template>
<script>
import searchHeader from '../../../components/outStorage/searchHeader.vue'
import editOutStorageInfo from '../../../components/outStorage/editOutStorageInfo.vue'
import send from '../../../components/outStorage/send.vue'
import httpService from '../../../common/httpService.js'
import addResource from '../../../components/outStorage/addResource.vue'
import newOutStorageForm from '../../../components/newOutStorageForm.vue'
import resImgShow from '../../../components/resImgShow.vue'
import api from '../../../common/api.js'
export default {
    name: 'outStorage-view',
    data() {
        return {
             logisticsShow:false,
            logisticsInfo:[],
            showImg: false,
            imageArray: [],
            isFormShow: false,
            loading: false,
            loading2: false,
            loadingInfo: false,
            sendSonLoading: false,
            formData: {
                no: '',
                batchNo: '',
                description: '',
                comment: '',
                depotType: '',
                consigneeName: '',
                consigneePhone: '',
                contactName: '',
                contactPhone: '',
                virtual: '',
                customerId: '',
                customerName: '',
                depotId: '',
                depotName: '',
                source: '',
                validate: '',
                verifier: '',
                taskKey: '',
                outTimeStart: '',
                outTimeEnd: '',
                page: 1,
                pageSize: 10
            },
            beforehandId: '',
            sendOutStorageItems: []
        }
    },
    computed: {
        tableData() {
            return this.$store.state.outStorage.outStorageList.list;
        },
        total() {
            return this.$store.state.outStorage.outStorageList.total;
        },
        dialog() {
            return this.$store.state.outStorage.dialog;
        },
        tableInfoList() {
            return this.$store.state.outStorage.outStorageInfoList.stockOutItems;
        },
        restrictions() {
            let arr = this.$store.state.user.menus;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name === '出库管理') {
                    for (var j = 0; j < arr[i].children.length; j++) {
                        if (arr[i].children[j].title === '出库单管理') {
                            let obj = arr[i].children[j].validate
                            console.log(obj);
                            return obj;
                        };
                    }
                }
            }
            return {
                '审核通过': '',
                '审核不通过': '',
                '导出PDF': '',
            };
        }
    },
    components: {
        searchHeader,
        editOutStorageInfo,
        addResource,
        newOutStorageForm,
        resImgShow,
        send
    },
    mounted() {
        this.getHttp();
    },
    methods: {
         viewLogistics(id){
            this.logisticsShow = true
            let body = {
                    biz_module: 'logisticsService',
                    biz_method: 'queryLogistics',
                    biz_param: {
                        code : 'yunda',
                        number :3101624653800
                    }
                };
            api.commonPOST(body).then(res =>{
                this.logisticsInfo = res.biz_result.data
            })
            console.log(id)
        },
        //校验
        validate(createrName) {
            let name = this.$store.state.user.user.name;
            if (name === createrName) {
                return true;
            } else {
                return false;
            }
        },
        // 头部搜索
        search(params) {
            if (params.type === 'clear') {
                this.formData = {
                    no: '',
                    batchNo: '',
                    description: '',
                    comment: '',
                    depotType: '',
                    consigneeName: '',
                    consigneePhone: '',
                    contactName: '',
                    contactPhone: '',
                    virtual: '',
                    customerId: '',
                    customerName: '',
                    depotId: '',
                    depotName: '',
                    source: '',
                    validate: '',
                    verifier: '',
                    taskKey: '',
                    outTimeStart: '',
                    outTimeEnd: '',
                    page: 1,
                    pageSize: 10
                }
            }
            this.getHttp('isSearch');
        },
        dialogClose() {
            this.$store.dispatch('out_changDialog', {});
        },
        changeForm(params) {
            if (!params.back && params.back != undefined && !params.isFormShow) {
                this.getHttp().then(() => {
                    this.isFormShow = params.isFormShow;
                })
            } else {
                this.isFormShow = params.isFormShow;
            }
        },
        //展示图片组件
        onShowImg(index) {
            this.imageArray = this.tableInfoList[index].imageArray;
            this.showImg = true;
        },
        //勾选预出库数组数据等于 表格选择后的数据
        tableSelected(item) {
            this.sendOutStorageItems = item;
        },
        // 表格编辑
        editItem(params) {
            let _self = this;
            _self.loading = true;
            //清除新添加的资源
            this.$store.dispatch('out_newClearResList').then(() => {
                _self.getInfoListById(params).then(() => {
                    _self.loading = false;
                    let obj = {
                        title: '编辑出库信息',
                        dialog: true,
                        showEdit: true
                    };
                    _self.$store.dispatch('out_changDialog', obj);
                }, () => {
                    _self.loading = false;
                });
            });

        },
        //表格删除
        del(params) {
            let _self = this;
            this.$confirm('确定删除该条信息吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'deleteStockOut',
                    biz_param: {
                        id: params,
                        beforehand: 0, //删除
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
                _self.$store.dispatch('out_deleteOutStorageById', obj).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.formData.page = 1;
                    this.getHttp();
                }, () => {
                    _self.loading = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        delResItem(paramsId) {
            let _self = this;
            this.$confirm('确定删除该条资源吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.loadingInfo = true;
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
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //获取资源信息
                    _self.getTransferInfoResList(_self.beforehandId).then(() => {
                        _self.formData.transferItems = _self.$store.state.preTransfer.preTransferInfoList;
                    });
                    _self.loadingInfo = false;
                }, () => {
                    _self.loadingInfo = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //获取资源信息列表
        getResInfoList(row, event, column) {
            if (column.label && column.label != '物流状态') {
                this.loading2 = true;
                //当前行的列表信息
                let id = row.id;
                let _self = this;
                if (id) {
                    this.beforehandId = id;
                    this.getInfoListById(id)
                } else {
                    _self.formData.stockOutItems = [];
                }
            }
        },
        getHttp(isSearch) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'queryStockOut',
                    biz_param: _self.formData
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
                _self.$store.dispatch('out_getOutStorageList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        //根据ID获取详情列表
        getInfoListById(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loadingInfo = true;
                let params = {
                    id: paramsId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'queryStockOutById',
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
                _self.$store.dispatch('out_getOutStorageInfoById', obj).then(() => {
                    _self.loadingInfo = false;
                    resolve();
                }, () => {
                    _self.loadingInfo = false;
                    reject();
                });

            })
        },
        // 分页事件        
        handleCurrentChange(val) {
            this.formData.page = val;
            this.getHttp().then(() => {
                this.loading2 = false;
            });
        },
        //申请审核
        applyReview(paramsId) {
            this.$confirm('确定提交申请审核？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //先获取该ID的资源信息            
                let _self = this;
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'applyReviewStockOut',
                    biz_param: {
                        id: paramsId
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
                _self.$store.dispatch('out_validateOutStorage', obj).then(() => {
                    _self.loading = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.getHttp();
                }, () => {
                    _self.loading = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //重新申请审核
        againReview(paramsId) {
            this.$confirm('确定提交重新申请审核？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _self = this;
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'reApplyReviewStockOut',
                    biz_param: {
                        id: paramsId
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
                _self.$store.dispatch('out_validateOutStorage', obj).then(() => {
                    _self.loading = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.getHttp();
                }, () => {
                    _self.loading = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //主管审核
        leadReview(params) {
            let tipStr = '';
            let btn_cmf = '';
            if (params.validate == 2) {
                tipStr = '确定审核通过？';
                btn_cmf = '审核通过';
            } else {
                tipStr = '确定审核不通过？';
                btn_cmf = '审核不通过';
            }
            this.$prompt('请输入审核信息', tipStr, {
                confirmButtonText: btn_cmf,
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '请填写审核信息'
            }).then(({
                value
            }) => {
                let _self = this;
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'validateStockOut',
                    biz_param: {
                        id: params.id,
                        validate: params.validate,
                        description: value
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
                _self.$store.dispatch('out_validateOutStorage', obj).then(() => {
                    this.getHttp().then(() => {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    });
                }, () => {
                    _self.loading = false;
                    this.getHttp();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //取消审核流程
        cancleValidate(paramsId) {
            this.$confirm('确定结束审核流程？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _self = this;
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'cancle',
                    biz_param: {
                        id: paramsId
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
                _self.$store.dispatch('out_validateOutStorage', obj).then(() => {
                    _self.loading = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.getHttp();
                }, () => {
                    _self.loading = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //导出PDF
        exportPDF(paramsId) {
            this.$confirm('确定导出PDF?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                let _self = this;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'stockOutPdf',
                    biz_param: {
                        id: paramsId
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
                let newWindow = window.open('about:blank');
                _self.$store.dispatch('com_exportPDF', obj).then((res) => {
                    newWindow.location.href = res.msg;
                }, () => {});
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        //发货
        send(params) {
            let _self = this;
            this.getConsigneeInfo(params.id).then(() => {
                let obj = {
                    title: '发货',
                    dialog: true,
                    showSend: true
                };
                _self.$store.dispatch('out_changDialog', obj);

            }, () => {


            });;

        },
        //获取销售订单收货人信息
        getConsigneeInfo(id) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loadingInfo = true;
                let params = {
                    id: id
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockOutService',
                    biz_method: 'findReceivingAddress',
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
                _self.$store.dispatch('out_getConsigneeInfo', obj).then(() => {
                    _self.loadingInfo = false;

                    resolve();
                }, () => {
                    _self.loadingInfo = false;
                    reject();
                });

            })
        }

    }
}
</script>