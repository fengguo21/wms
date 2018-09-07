<style lang="less" scoped>
// 移库单管理
.moveStorage {
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
        <div class="moveStorage" v-if="!isFormShow">
            <searchHeader v-on:search="search" :formData="formData" v-on:changeForm="changeForm"></searchHeader>
            <!-- 表格 -->
            <div class="table">
                <el-table highlight-current-row v-on:row-click="tableInfoSelect" :data="tableData" border stripe style="width: 100%; margin: auto" v-loading="loading">
                    <el-table-column label="操作" width="80" fixed="left">
                        <template scope="scope">
                            <el-dropdown>
                                <el-button type="text">
                                    <i class="el-icon-caret-bottom  el-icon-setting"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown" menu-align="start">
                                    <!--  <el-dropdown-item v-if="restrictions['导出PDF'] === 'P522-F542' || validate(scope.row.createrName)">
                                        <el-button @click="exportPDF(scope.row.id)" type="text" size="small">导出PDF</el-button>
                                    </el-dropdown-item> -->
                                    <el-dropdown-item v-if="scope.row.validate != 2 && validate(scope.row.createrName)">
                                        <el-button @click="edit(scope.row.id)" type="text" size="small">编&nbsp;&nbsp;&nbsp;&nbsp;辑</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != 2 && validate(scope.row.createrName)">
                                        <el-button @click="del(scope.row.id)" type="text" size="small">删&nbsp;&nbsp;&nbsp;&nbsp;除</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == 0 && validate(scope.row.createrName)">
                                        <el-button @click="applyReview(scope.row.id)" type="text" size="small">申请审核</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == -2 && validate(scope.row.createrName)">
                                        <el-button @click="againReview(scope.row.id)" type="text" size="small">重新申请审核</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate == -2 && validate(scope.row.createrName)">
                                        <el-button @click="cancle(scope.row.id)" type="text" size="small">审核流程取消</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != 2 && scope.row.validate != -2 && scope.row.validate == 1 && restrictions['审核通过'] === 'P522-F540'">
                                        <el-button @click="leadReview({id:scope.row.id, validate: 2})" type="text" size="small">审核通过</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.validate != 2 && scope.row.validate != -2 && scope.row.validate == 1 && restrictions['审核不通过'] === 'P522-F541'">
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
                    <el-table-column prop="no" label="移库单号" width="240">
                    </el-table-column>
                    <el-table-column label="移库日期" width="140">
                        <template scope="scope">
                            <span>{{scope.row.moveDate | filterTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerName" label="货主" width="140">
                    </el-table-column>
                    <el-table-column prop="contactName" label="联系人" width="120">
                    </el-table-column>
                    <el-table-column prop="contactPhone" label="联系手机" width="160">
                    </el-table-column>
                    <el-table-column prop="depotName" label="仓库名" width="160">
                    </el-table-column>
                    <el-table-column prop="comment" label="备注" min-width="200">
                    </el-table-column>
                    <el-table-column prop="description" label="审核信息" width="200" fixed="right">
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog size="large" v-on:close="dialogClose" style="text-align:center" :title="dialogVisible.title" v-model="dialogVisible.dialog">
                <editMoveStorageInfo v-if="dialogVisible.showEdit" v-on:showChangeEdit="showChangeEdit"></editMoveStorageInfo>
                <editAddResource v-if="dialogVisible.showAdd" v-on:showChangeEdit="showChangeEdit"></editAddResource>
            </el-dialog>
            <!-- 分页 -->
            <div class="pages">
                <el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <div style="text-align: center" v-show="!loading2">
                <span>选中表格获取资源信息......</span>
            </div>
            <!-- 表格2 -->
            <div class="table_bot clearfix" v-show="loading2">
                <el-col :span="20">
                    <el-table max-height="450" highlight-current-row :data="Items" align="left" border stripe style="width: 1160px;" v-loading="loadingInfo">
                        <el-table-column label="操作" width="80">
                            <template scope="scope" v-if="scope.row.imageArray">
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
                        <el-table-column label="片型" width="120">
                            <template scope="scope">
                                <span v-if="scope.row.specAttribute[scope.row.breedName]">
                                {{scope.row.specAttribute[scope.row.breedName]['片型']}}
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="产地" width="140">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="number" label="移库数量" width="120">
                        </el-table-column>
                        <el-table-column prop="unitId" label="单位" width="80">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="原库位">
                            <template scope="scope">
                                <span>{{scope.row.oldSiteName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="现库位">
                            <template scope="scope">
                                <span>{{scope.row.newSiteName}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </div>
        <div v-if="isFormShow">
            <newMoveStorageForm :radio="0" v-on:changeForm="changeForm"></newMoveStorageForm>
        </div>
        <!-- 图片展示 -->
        <el-dialog size="tiny" style="text-align:center" title="资源图片展示" v-model="showImg">
            <resImgShow :imageArray="imageArray"></resImgShow>
        </el-dialog>
    </div>
</template>
<script>
import searchHeader from '../../../components/moveStorage/searchHeader.vue'
import editMoveStorageInfo from '../../../components/moveStorage/editMoveStorageInfo.vue'
import httpService from '../../../common/httpService.js'
import editAddResource from '../../../components/moveStorage/editAddResource.vue'
import newMoveStorageForm from '../../../components/newMoveStorageForm.vue'
import usableNum from '../../../components/usableNum.vue'
import resImgShow from '../../../components/resImgShow.vue'
export default {
    name: 'moveStorage-view',
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
                validate: '',
                moveDate: '',
                depotId: '',
                depotName: '',
                customerId: '',
                customerName: '',
                contactName: '',
                contactPhone: '',
                beginTime: '',
                endTime: '',
                comment: '',
                page: 1,
                pageSize: 10
            },
            searchInfoListId: ''
        }
    },
    computed: {
        tableData() {
            return this.$store.state.moveStorage.moveStorageList.list;
        },
        total() {
            return this.$store.state.moveStorage.moveStorageList.total;
        },
        Items() {
            return this.$store.state.moveStorage.moveStorageInfo.stockMoveItems;
        },
        restrictions() {
            let arr = this.$store.state.user.menus;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name === '移库管理') {
                    for (var j = 0; j < arr[i].children.length; j++) {
                        if (arr[i].children[j].title === '移库单管理') {
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
        editMoveStorageInfo,
        editAddResource,
        newMoveStorageForm,
        usableNum,
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
                    validate: '',
                    moveDate: '',
                    depotId: '',
                    depotName: '',
                    customerId: '',
                    customerName: '',
                    contactName: '',
                    contactPhone: '',
                    beginTime: '',
                    endTime: '',
                    comment: '',
                    page: 1,
                    pageSize: 10
                }
            }
            this.getHttp('isSearch');
        },
        //展示图片组件
        onShowImg(index) {
            this.imageArray = this.Items[index].imageArray;
            this.showImg = true;
        },
        dialogClose() {
            this.dialogVisible.dialog = false;
            this.dialogVisible.showEdit = false;
            this.dialogVisible.showAdd = false;
            this.dialogVisible.title = '';
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
        // 切换预过户表单数量显示
        showChange(params) {
            this.dialogTransfer.dialog = params.dialog;
            this.editFormData = params.editFormData;
        },
        // 切换编辑表单显示
        showChangeEdit(params) {
            this.dialogVisible = params;
            //获取数据
            if (!params.dialog) {
                this.getHttp();
                if (this.searchInfoListId) {
                    this.getTransferInfoResList(this.searchInfoListId);
                }
            }
        },
        // 表格编辑
        edit(params) {
            this.$store.dispatch('mov_NewClearResList')
            let _self = this;
            _self.loading = true;
            this.getTransferInfoResList(params).then(() => {
                _self.dialogVisible.dialog = true;
                _self.dialogVisible.showEdit = true;
                _self.dialogVisible.showAdd = false;
                _self.dialogVisible.title = '编辑移库单信息';
                _self.loading = false;
            }, () => {
                _self.loading = false;
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
                        biz_module: 'wmsStockMoveService',
                        biz_method: 'deleteStockMove',
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
                _self.$store.dispatch('mov_deleteMoveStorageItem', obj).then(() => {
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
                    message: '已取消删除'
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
                let _self = this;
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockMoveService',
                        biz_method: 'applyReviewStockMove',
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
                _self.$store.dispatch('mov_validateHandle', obj).then(() => {
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
                    message: '已取消删除'
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
                        biz_module: 'wmsStockMoveService',
                        biz_method: 'reApplyReviewStockMove',
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
                _self.$store.dispatch('mov_validateHandle', obj).then(() => {
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
                    message: '已取消删除'
                });
            });
        },
        // 审核取消
        cancle(paramsId) {
            this.$confirm('确定取消移库审核流程？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _self = this;
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockMoveService',
                        biz_method: 'cancle',
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
                _self.$store.dispatch('mov_validateHandle', obj).then(() => {
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
                    message: '已取消删除'
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
                        biz_module: 'wmsStockMoveService',
                        biz_method: 'validateStockMove',
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
                _self.$store.dispatch('mov_validateHandle', obj).then(() => {
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
                    message: '已取消删除'
                });
            });
        },
        //取消入库 只有在审核不通过时才能执行此操作
        closeStockIn() {
            if (this.sendStockInItems.length === 0) {
                this.$message({
                    type: 'info',
                    message: '请选择要操作的资源'
                });
                return;
            }
            let _self = this;
            this.$confirm('确定取消入库吗', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'cancle',
                        biz_param: {
                            id: _self.beforehandId
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
                _self.$store.dispatch('put_cancle', obj).then(() => {
                    _self.loading = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                }, () => {
                    _self.loading = false;
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
                _self.loading = false;
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
                    this.searchInfoListId = id;
                    this.getTransferInfoResList(id);
                } else {
                    this.Items = [];
                }
            }
        },
        // 获取列表数据
        getHttp(isSearch) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockMoveService',
                        biz_method: 'queryStockMoveList',
                        biz_param: this.formData
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
                _self.$store.dispatch('mov_getMoveStorageList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        //根据ID获取详情列表
        getTransferInfoResList(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loadingInfo = true;
                let params = {
                    id: paramsId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockMoveService',
                        biz_method: 'queryStockMoveById',
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
                _self.$store.dispatch('mov_getMoveStorageInfoById', obj).then(() => {
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

    }
}
</script>
