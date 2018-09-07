<style lang="less" scoped>
// 入库单管理
.putInStorage {
    width: 100%;
    // 按鈕部份
    .btn_wrap {
        text-align: center;
    }
    // 表格部分
    .table {
        width: 100%;
    }
    // 分页部分
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
    }
    // 操作部分
    .handle {
        width: 100%;
        margin: auto;
        padding: 10px;
    }
    // 底部表格
    .table_bot {
        width: 100;
        margin: auto;
        margin-top:40px;
        padding-top: 10px;
        padding-bottom: 100px;
    }
}
</style>
<template>
    <div>
        <div class="putInStorage" v-if="!isFormShow">
            <searchHeader v-on:search="search" :formData="formData" v-on:changeForm="changeForm"></searchHeader>
            <!-- 表格 -->
            <div class="table">
                <el-table highlight-current-row :data="tableData" v-on:row-click="tableInfoSelect" border stripe style="width: 100%; margin: auto" v-loading="loading">
                    <el-table-column label="操作" width="80" fixed="left">
                         <template scope="scope">
                            <el-button  v-on:row-click="tableInfoSelect"  type="text" size="small">详情</el-button>
                        </template>
                        <!--<template scope="scope">
                            <el-dropdown>
                                <el-button type="text">
                                    <i class="el-icon-caret-bottom  el-icon-setting"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown" menu-align="start">
                                    <el-dropdown-item v-if="restrictions['导出PDF'] === 'P514-F532' || validate(scope.row.createrName) ">
                                        <el-button :disabled="scope.row.validate != 2" @click="exportPDF(scope.row.id)" type="text" size="small">导出PDF</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != 2 && scope.row.validate != 1 && validate(scope.row.createrName)">
                                        <el-button @click="edit(scope.row.id)" type="text" size="small">编&nbsp;&nbsp;&nbsp;&nbsp;辑</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != 2 && scope.row.validate != 1 && validate(scope.row.createrName)">
                                        <el-button @click="del(scope.row.id)" type="text" size="small">删&nbsp;&nbsp;&nbsp;&nbsp;除</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == 0  && validate(scope.row.createrName)">
                                        <el-button @click="applyReview(scope.row.id)" type="text" size="small">申请审核</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == -2 && validate(scope.row.createrName)">
                                        <el-button @click="againReview(scope.row.id)" type="text" size="small">重新申请审核</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == -2 && validate(scope.row.createrName)">
                                        <el-button @click="cancleValidate(scope.row.id)" type="text" size="small"> 取消审核流程</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != 2 && scope.row.validate != -2 && scope.row.validate == 1 && restrictions['审核通过'] === 'P514-F529'">
                                        <el-button @click="leadReview({id:scope.row.id, validate: 2})" type="text" size="small">审核通过</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != 2 && scope.row.validate != -2 && scope.row.validate == 1 && restrictions['审核不通过'] === 'P514-F530'">
                                        <el-button @click="leadReview({id:scope.row.id, validate: -2})" type="text" size="small">审核不通过</el-button>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>-->

                    </el-table-column>
                    
                    <!--<el-table-column prop="comment" label="审核状态" width="150">
                        <template scope="scope">
                            <span>{{scope.row.validate,scope.row.verifierName | filterValidate}}</span>
                        </template>
                    </el-table-column>-->
                    <el-table-column prop="no" label="入库单号" width="230">
                    </el-table-column>
                     <el-table-column prop="purchaserName" label="采购人" width="120">
                    </el-table-column>
                    <el-table-column  label="状态" width="120">
                        <template scope="scope">
                                <span>{{scope.row.state | filterStockState}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column label="入库日期" width="140">
                        <template scope="scope">
                            <span>{{scope.row.inTime | filterTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerName" label="货主名称" width="160">
                    </el-table-column>
                    <el-table-column prop="contactName" label="供应商" width="120">
                    </el-table-column>
                    <el-table-column prop="contactName" label="供应商联系人" width="120">
                    </el-table-column>
                    <el-table-column prop="contactPhone" label="联系电话" width="140">
                    </el-table-column>
                    <el-table-column prop="depotName" label="仓库名称" width="140">
                    </el-table-column>
                    <el-table-column prop="depotType" label="库存类型" min-width="100">
                    </el-table-column>
                    <el-table-column  label="物流状态" width="160">
                            <template scope="scope">
                                    <el-button  @click='viewLogistics(scope.row.id)'  type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                    <el-table-column prop="createrName" label="入库经手人" width="200">
                    </el-table-column>
                    <!--<el-table-column prop="description" label="审核信息" width="200" fixed="right">
                    </el-table-column>-->
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pages">
                <div class="btn_wrap" v-if="showClose">
                    <el-button @click="closeStockIn" size="small" type="primary">取消入库</el-button>
                </div>
                <el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <el-dialog size="large" style="text-align:center" :title="dialog.title" v-model="dialog.dialog">
                <editStockInfo v-if="dialog.showEdit" v-on:clearData="clearData" v-on:editGetHttp="editGetHttp"></editStockInfo>
                <addResource type="inEdit" v-if="dialog.showAdd" :formData="resData"></addResource>
            </el-dialog>
            <!-- 表格2 -->
            <div style="text-align: center" v-show="!loading2">
                <span>选中表格获取资源信息......</span>
            </div>
            <div class="table_bot clearfix" v-show="loading2">
                 <h3>详情：</h3>
                <el-col :span="20">
                    <el-table align="center" empty-text="当前资源信息未获取,或者为空" v-on:selection-change="tableSelected" max-height="400" :data="stockInItems" border stripe style="width: 1000px;" v-loading="loadingInfo">
                        <el-table-column v-if="showClose" type="selection" width="50">
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                            <template scope="scope">
                                <el-button :disabled="scope.row.imageArray.length == 0" @click="onShowImg(scope.$index)" type="text" icon="picture"></el-button>
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
                        <!--<el-table-column label="片型" width="120">
                            <template scope="scope">
                                <span v-if="scope.row.specAttribute[scope.row.breedName]">
                                {{scope.row.specAttribute[scope.row.breedName]['片型']}}
                            </span>
                            </template>
                        </el-table-column>-->
                        <el-table-column label="产地" width="120">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="入库数量" width="120">
                        </el-table-column>
                        <el-table-column label="单位" width="80">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                         
                        <el-table-column prop="siteName" label="库位">
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </div>
        <div v-if="isFormShow">
            <newInStorageForm :radio="1" v-on:changeForm="changeForm"></newInStorageForm>
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
import searchHeader from '../../../components/putInStorage/searchHeader.vue'
import editStockInfo from '../../../components/putInStorage/editStockInfo.vue'
import httpService from '../../../common/httpService.js'
import addResource from '../../../components/preStorage/addResource.vue'
import newInStorageForm from '../../../components/newInStorageForm.vue'
import resImgShow from '../../../components/resImgShow.vue'
import api from '../../../common/api.js'
import {
    filterUnit,filterStockState
} from '../../../filters/index.js'
export default {
    name: 'putInStorage-view',
    data() {
        return {
             logisticsShow:false,
            logisticsInfo:[],
            PDFUrl: '',
            showImg: false,
            imageArray: [],
            isFormShow: false,
            loading: false,
            loading2: false,
            loadingInfo: false,
            showClose: false,
            dialogstockIn: {
                dialog: false
            },
            formData: {
                no: '',
                batchNo: '',
                description: '',
                comment: '',
                depotType: '',
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
                inTimeStart: '',
                inTimeEnd: '',
                stockInItems: [],
                page: 1,
                pageSize: 10
            },
            sendStockInItems: [],
            resData: {
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
            },
        }
    },
    computed: {
        tableData() {
            return this.$store.state.putInStorage.putInStorageList.list;
        },
        total() {
            return this.$store.state.putInStorage.putInStorageList.total;
        },
        dialog() {
            return this.$store.state.common.dialog;
        },
        stockInItems() {
            return this.$store.state.putInStorage.putstockInfo.stockInItems;
        },
        //权限
        restrictions() {
            let arr = this.$store.state.user.menus;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name === '入库管理') {
                    for (var j = 0; j < arr[i].children.length; j++) {
                        if (arr[i].children[j].title === '入库单管理') {
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
        editStockInfo,
        addResource,
        newInStorageForm,
        resImgShow
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
                    inTimeStart: '',
                    inTimeEnd: '',
                    stockInItems: [],
                    page: 1,
                    pageSize: 10
                };
            }
            this.getHttp('isSearch');
        },
        //展示图片组件
        onShowImg(index) {
            this.imageArray = this.stockInItems[index].imageArray;
            this.showImg = true;
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
        //勾选入库单的数组数据等于 表格选择后的数据
        tableSelected(item) {
            this.sendStockInItems = item;
        },
        // 表格编辑
        edit(params) {
            let _self = this;
            this.getStockInfo(params).then(function() {
                //每次编辑 必须清除Vuex中新建资源列表的数据 已保证数据展示准确
                _self.$store.dispatch('put_InStorNewClearResList').then(() => {
                    let obj = {
                            dialog: true,
                            showEdit: true,
                            title: '编辑入库信息'
                        }
                        //切换显示
                    _self.$store.dispatch('com_changeShowDialog', obj);
                })

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
                this.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'deleteStockIn',
                        biz_param: {
                            id: params
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
                _self.$store.dispatch('put_deleteStockIn', obj).then(() => {
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
                    biz_module: 'wmsStockInService',
                    biz_method: 'stockInPdf',
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
        //申请审核
        applyReview(paramsId) {
            this.$confirm('确定提交申请审核？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                let _self = this;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'applyReview',
                        biz_param: {
                            id: paramsId
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
                _self.$store.dispatch('put_applyReview', obj).then(() => {
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
                this.loading = true;
                let _self = this;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'reapply',
                        biz_param: {
                            id: paramsId
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
                _self.$store.dispatch('put_applyReview', obj).then(() => {
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
            this.$prompt('请填写审核信息', tipStr, {
                confirmButtonText: btn_cmf,
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '请填写审核信息'
            }).then(({
                value
            }) => {
                this.loading = true;
                let _self = this;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'validate',
                        biz_param: {
                            id: params.id,
                            validate: params.validate,
                            description: value
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
                _self.$store.dispatch('put_applyReview', obj).then(() => {
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
                    biz_module: 'wmsStockInService',
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
                _self.$store.dispatch('put_applyReview', obj).then(() => {
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
        //获取资源信息
        tableInfoSelect(row, event, column) {
            if (column.label) {
                this.loading2 = true;
                //当前行的列表信息
                let id = row.id;
                let _self = this;
                if (id) {
                    this.loadingInfo = true;
                    this.beforehandId = id;
                    this.getStockInfo(id);
                } else {
                    _self.stockInItems = [];
                }
            }
        },
        getHttp(isSearch) {
            let _self = this;
            return new Promise((resolve, reject) => {
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'queryStockIn',
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
                _self.$store.dispatch('put_getInStorageList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
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
                    biz_method: 'queryStockInById',
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
                _self.$store.dispatch('put_getStockInfo', obj).then(() => {
                    resolve();
                    _self.loadingInfo = false;
                }, () => {
                    reject();
                    _self.loadingInfo = false;
                });

            })
        },
        // 分页事件        
        handleCurrentChange(val) {
            this.loading = true;
            this.formData.page = val;
            this.getHttp().then(() => {
                this.loading2 = false;
            });
        },
        clearData() {
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
        },
        editGetHttp(paramsId) {
            this.getHttp().then(() => {
                this.getStockInfo(paramsId.id).then(() => {
                    this.$store.dispatch('com_changeShowDialog', {}).then(() => {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    });
                })
            })
        }
    }
}
</script>
