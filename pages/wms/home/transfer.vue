<style lang="less" scoped>
// 过户管理
.transfer {
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
        padding-top: 10px;
        padding-bottom: 100px;
    }
}
</style>
<template>
    <div>
        <div class="transfer" v-if="!isFormShow">
            <searchHeader v-on:search="search" :formData="formData" v-on:changeForm="changeForm"></searchHeader>
            <!-- 表格 -->
            <div class="table">
                <el-table highlight-current-row :data="tableData" v-on:row-click="tableInfoSelect" border stripe style="width: 100%; margin: auto" v-loading="loading">
                    <el-table-column label="操作" width="80" fixed="left">
                        <template scope="scope">
                            <el-dropdown>
                                <el-button type="text">
                                    <i class="el-icon-setting"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown" menu-align="start">
                                    <el-dropdown-item v-if="restrictions['导出PDF'] === 'P520-F537' || validate(scope.row.createrName)">
                                        <el-button :disabled="scope.row.validate != 2" @click="exportPDF(scope.row.id)" type="text" size="small">导出PDF</el-button>
                                    </el-dropdown-item>
                                    <!--     <el-dropdown-item v-if="scope.row.validate != 2 && validate(scope.row.createrName)">
                                        <el-button @click="editItem(scope.row.id)" type="text" size="small">编&nbsp;&nbsp;&nbsp;辑</el-button>
                                    </el-dropdown-item> -->
                                    <!--     <el-dropdown-item v-if="scope.row.validate != 2 && validate(scope.row.createrName)">
                                        <el-button @click="del(scope.row.id)" type="text" size="small">删&nbsp;&nbsp;&nbsp;除</el-button>
                                    </el-dropdown-item> -->
                                    <el-dropdown-item v-if="scope.row.validate == 0  && validate(scope.row.createrName)">
                                        <el-button @click="applyReview(scope.row.id)" type="text" size="small">申请审核</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == -2 && validate(scope.row.createrName)">
                                        <el-button @click="againReview(scope.row.id)" type="text" size="small">重新申请审核</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == -2 && validate(scope.row.createrName)">
                                        <el-button @click="cancleValidate(scope.row.id)" type="text" size="small"> 取消审核流程</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != -2 && scope.row.validate != 2 && scope.row.validate == 1 && restrictions['审核通过'] === 'P520-F535'">
                                        <el-button @click="leadReview({id:scope.row.id, validate: 2})" type="text" size="small">审核通过</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != -2 && scope.row.validate != 2 && scope.row.validate == 1 && restrictions['审核不通过'] === 'P520-F536'">
                                        <el-button @click="leadReview({id:scope.row.id, validate: -2})" type="text" size="small">审核不通过</el-button>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createrName" label="创建人" width="120">
                    </el-table-column>
                    <el-table-column prop="comment" label="审核状态" width="150">
                        <template scope="scope">
                            <span>{{scope.row.validate,scope.row.verifierName | filterValidate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="no" label="过户单号" width="240">
                    </el-table-column>
                    <el-table-column label="过户时间" width="160">
                        <template scope="scope">
                            <span>{{scope.row.transferTime | filterTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="originName" label="原货主名称" width="160">
                    </el-table-column>
                    <el-table-column prop="contactName" label="联系人" width="100">
                    </el-table-column>
                    <el-table-column prop="contactPhone" label="联系方式" width="140">
                    </el-table-column>
                    <el-table-column prop="newName" label="新货主名称" width="160">
                    </el-table-column>
                    <el-table-column prop="contactNameNew" label="新联系人" width="100">
                    </el-table-column>
                    <el-table-column prop="contactPhoneNew" label="新联系方式" width="140">
                    </el-table-column>
                    <el-table-column prop="depotName" label="仓库名称" width="160">
                    </el-table-column>
                    <el-table-column prop="source" label="过户类型" min-width="100">
                        <template scope="scope">
                            <span v-if="scope.row.source ==0">货主过户</span>
                            <span v-if="scope.row.source ==1">销售过户</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="comment" label="备注" width="180">
                    </el-table-column>
                    <el-table-column prop="description" label="审核描述" width="200" fixed="right">
                    </el-table-column>
                </el-table>
            </div>
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
                <el-col :span="18">
                    <el-table align="center" empty-text="当前资源信息未获取,或者为空" max-height="400" :data="transferItems" border stripe style="width: 1120px;" v-loading="loadingInfo">
                        <el-table-column label="操作" width="80">
                            <template scope="scope" v-if="scope.row.imageArray">
                                <el-button :disabled="scope.row.imageArray.length == 0" @click="onShowImg(scope.$index)" type="text" icon="picture"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="breedName" label="品名" width="140">
                        </el-table-column>
                        <el-table-column label="规格" width="260">
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
                        <el-table-column label="产地" width="160">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="num" label="过户数量" width="120">
                        </el-table-column>
                        <el-table-column label="单位" width="80">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="depotType" label="库存类型">
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </div>
        <div v-if="isFormShow">
            <newTransferForm :radio="0" v-on:changeForm="changeForm"></newTransferForm>
        </div>
        <!-- 图片展示 -->
        <el-dialog size="tiny" style="text-align:center" title="资源图片展示" v-model="showImg">
            <resImgShow :imageArray="imageArray"></resImgShow>
        </el-dialog>
    </div>
</template>
<script>
import searchHeader from '../../../components/transfer/searchHeader.vue'
import httpService from '../../../common/httpService.js'
import newTransferForm from '../../../components/newTransferForm.vue'
import resImgShow from '../../../components/resImgShow.vue'
export default {
    name: 'transfer-view',
    data() {
        return {
            showImg: false,
            imageArray: [],
            isFormShow: false,
            loading: false,
            loading2: false,
            loadingInfo: false,
            dialogVisible: {
                dialog: false,
                title: '',
                showEdit: false,
                showAdd: false
            },
            dialogTransfer: {
                dialog: false
            },
            formData: {
                no: '',
                source: '',
                depotId: '',
                depotName: '',
                depotName: '',
                customerNew: '',
                customerNewName: '',
                contactNameNew: '',
                contactPhoneNew: '',
                customerOrigin: '',
                customerOriginName: '',
                contactName: '',
                contactPhone: '',
                timeStart: '',
                timeEnd: '',
                beforehand: 0,
                comment: '',
                validate: '',
                page: 1,
                pageSize: 10
            },
            sendTransferItems: [],
            editFormData: {},
            beforehandId: '',
        }
    },
    computed: {
        tableData() {
            return this.$store.state.transfer.endTransferList.list;
        },
        total() {
            return this.$store.state.transfer.endTransferList.total;
        },
        transferItems() {
            return this.$store.state.transfer.endTransferInfoList.list;
        },
        restrictions() {
            let arr = this.$store.state.user.menus;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name === '过户管理') {
                    for (var j = 0; j < arr[i].children.length; j++) {
                        if (arr[i].children[j].title === '过户单管理') {
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
        newTransferForm,
        resImgShow
    },
    mounted() {
        this.getHttp();
    },
    methods: {
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
                    source: '',
                    depotId: '',
                    depotName: '',
                    depotName: '',
                    customerNew: '',
                    customerNewName: '',
                    contactNameNew: '',
                    contactPhoneNew: '',
                    customerOrigin: '',
                    customerOriginName: '',
                    contactName: '',
                    contactPhone: '',
                    timeStart: '',
                    timeEnd: '',
                    beforehand: 0,
                    comment: '',
                    validate: '',
                    page: 1,
                    pageSize: 10
                }
            }
            this.getHttp('isSearch');
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
            this.imageArray = this.transferItems[index].imageArray;
            this.showImg = true;
        },
        // 表格编辑
        // editItem(params) {
        //     let _self = this;
        //     _self.loading = true;
        //     //清除新添加的资源
        //     this.$store.dispatch('out_newClearResList').then(() => {
        //         _self.getInfoListById(params).then(() => {
        //             _self.loading = false;
        //             let obj = {
        //                 title: '编辑出库信息',
        //                 dialog: true,
        //                 showEdit: true
        //             };
        //             _self.$store.dispatch('out_changDialog', obj);
        //         }, () => {
        //             _self.loading = false;
        //         });
        //     });

        // },
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
                    biz_module: 'wmsStockTransferService',
                    biz_method: 'deleteTransfer',
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
                _self.$store.dispatch('end_deletePreTransfer', obj).then(() => {
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
                        biz_module: 'wmsStockTransferService',
                        biz_method: 'applyValidate',
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
                    biz_module: 'wmsStockTransferService',
                    biz_method: 'reapplyValidate',
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
                _self.$store.dispatch('end_validateTransfer', obj).then(() => {
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
                        biz_module: 'wmsStockTransferService',
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
                _self.$store.dispatch('end_validateTransfer', obj).then(() => {
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
                    biz_module: 'wmsStockTransferService',
                    biz_method: 'cancleValidate',
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
                _self.$store.dispatch('end_validateTransfer', obj).then(() => {
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
        //获取资源信息
        tableInfoSelect(row, event, column) {
            if (column.label && column.label != '操作') {
                this.loading2 = true;
                //当前行的列表信息
                let id = row.id;
                let _self = this;
                if (id) {
                    this.beforehandId = id;
                    this.getTransferInfo(id)
                } else {
                    _self.formData.transferItems = [];
                }
            }
        },
        getHttp(isSearch) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockTransferService',
                        biz_method: 'queryTransferList',
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
                _self.$store.dispatch('end_getPreTransferList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        //根据ID获取详细的预入库单信息
        getTransferInfo(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loadingInfo = true;
                let params = {
                    transferId: paramsId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockTransferService',
                    biz_method: 'queryTransferItemList',
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
                _self.$store.dispatch('end_getTransferInfo', obj).then(() => {
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
                    biz_module: 'wmsStockTransferService',
                    biz_method: 'stockTransferPdf',
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
                    console.log(res);
                    newWindow.location.href = res.msg;
                }, () => {});
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },

    }
}
</script>
