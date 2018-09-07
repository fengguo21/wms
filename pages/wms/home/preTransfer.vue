<style lang="less" scoped>
// 预过户管理
.preTransfer {
    width: 100%;
    // 按鈕部份
    .btn_wrap {
        text-align: center;
        width: 100%;
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
        <div class="preTransfer" v-if="!isFormShow && showTransferForm == false ">
            <searchHeader v-on:search="search" :formData="formData" v-on:changeForm="changeForm"></searchHeader>
            <!-- 表格 -->
            <div class="table">
                <el-table highlight-current-row :data="tableData" v-on:row-click="getResInfoList" border stripe style="width: 100%; margin: auto" v-loading="loading">
                    <el-table-column label="操作" width="120">
                        <template scope="scope">
                            <el-button :disabled="!validate(scope.row.createrName)" @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button :disabled="!validate(scope.row.createrName)" @click="del(scope.row.id)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createrName" label="创建人" width="120">
                    </el-table-column>
                    <el-table-column label="预过户日期" width="120">
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
                    <el-table-column prop="depotName" label="仓库名称" width="120">
                    </el-table-column>
                    <el-table-column prop="source" label="过户类型" width="120">
                        <template scope="scope">
                            <span v-if="scope.row.source ==0">货主过户</span>
                            <span v-if="scope.row.source ==1">销售过户</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="comment" label="备注">
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog size="large" v-on:close="dialogClose" style="text-align:center" :title="dialog.title" v-model="dialog.dialog">
                <editTransferInfo v-if="dialog.showEdit" v-on:editGetHttp="editGetHttp" :loadingAdd="sendSonLoading"></editTransferInfo>
                <editAddResource :transferId="transferId" v-if="dialog.showAdd"></editAddResource>
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
                <el-col :span="2">
                    <div class="btn_wrap">
                        <el-button v-if="btnValidate" @click="transfer" size="small" type="primary">正式过户</el-button>
                    </div>
                </el-col>
                <el-col :span="22">
                    <el-table align="center" empty-text="当前资源已经全部过户,或资源信息为空" v-on:selection-change="tableSelected" max-height="400" :data="transferItems" border stripe style="width: 100%;" v-loading="loadingInfo">
                        <el-table-column :selectable="debCheckBox" type="selection" width="45" v-if="btnValidate">
                        </el-table-column>
                        <el-table-column label="操作" width="70">
                            <template scope="scope" v-if="scope.row.imageArray">
                                <el-button :disabled="scope.row.imageArray.length == 0" @click="onShowImg(scope.$index)" type="text" icon="picture"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="breedName" label="品名" width="120">
                        </el-table-column>
                        <el-table-column label="规格" min-width="240">
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
                        <el-table-column prop="numNow" label="预过户数量" width="140">
                            <template scope="scope">
                                <myInput :disabled="!btnValidate" :stockId="scope.row.id" :maxNum="scope.row.numUn" v-model="scope.row.num"></myInput>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numEd" label="已过户数量" width="120">
                        </el-table-column>
                        <el-table-column prop="numIng" label="正在过户数量" width="130">
                        </el-table-column>
                        <el-table-column prop="numUn" label="剩余数量" width="120">
                        </el-table-column>
                        <el-table-column label="单位" width="80">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="depotType" label="库存类型" width="120">
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </div>
        <div v-if="isFormShow && showTransferForm == false ">
            <newTransferForm :radio="1" v-on:changeForm="changeForm"></newTransferForm>
        </div>
        <div v-if="showTransferForm">
            <transferForm :formData="transferFormData" v-on:ChangeShowTransferForm="ChangeShowTransferForm"></transferForm>
        </div>
        <!-- 图片展示 -->
        <el-dialog size="tiny" style="text-align:center" title="资源图片展示" v-model="showImg">
            <resImgShow :imageArray="imageArray"></resImgShow>
        </el-dialog>
    </div>
</template>
<script>
import searchHeader from '../../../components/preTransfer/searchHeader.vue'
import editTransferInfo from '../../../components/preTransfer/editTransferInfo.vue'
import httpService from '../../../common/httpService.js'
import editAddResource from '../../../components/preTransfer/editAddResource.vue'
import newTransferForm from '../../../components/newTransferForm.vue'
import myInput from '../../../components/myInput.vue'
import usableNum from '../../../components/usableNum.vue'
import transferForm from '../../../components/preTransfer/transferForm.vue'
import resImgShow from '../../../components/resImgShow.vue'
export default {
    name: 'preTransfer-view',
    data() {
        return {
            showImg: false,
            imageArray: [],
            btnValidate: false,
            isFormShow: false,
            showTransferForm: false,
            transferFormData: {
                resItems: [],
            },
            unDisabled: -1,
            loading: false,
            loading2: false,
            loadingInfo: false,
            sendSonLoading: false,
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
                beforehand: 1,
                comment: '',
                page: 1,
                pageSize: 10
            },
            sendTransferItems: [],
            editFormData: {},
            beforehandId: '',
            transferId: '', //收集编辑时的资源信息发送给子组件
        }
    },
    computed: {
        tableData() {
            return this.$store.state.preTransfer.preTransferList.list;
        },
        total() {
            return this.$store.state.preTransfer.preTransferList.total;
        },
        dialog() {
            return this.$store.state.preTransfer.dialog;
        },
        transferItems() {
            let arr = this.$store.state.preTransfer.preTransferInfoList.list;
            let newArr = [];
            for (var key in arr) {
                if (arr[key].numUn > 0 || arr[key].numIng > 0) {
                    newArr.push(arr[key]);
                }
            }
            return newArr;
        }
    },
    components: {
        searchHeader,
        editTransferInfo,
        editAddResource,
        newTransferForm,
        myInput,
        transferForm,
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
                    beforehand: 1,
                    comment: '',
                    page: 1,
                    pageSize: 10
                }
            }         
            this.getHttp('isSearch');
        },
        ChangeShowTransferForm(params) {
            this.showTransferForm = params.showTransferForm
        },
        debCheckBox(row, index) {
            if (row.numNow === 0 || row.numUn === 0) {
                return false;
            } else {
                return true;
            }
        },
        //展示图片组件
        onShowImg(index) {
            this.imageArray = this.transferItems[index].imageArray;
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
        //勾选预过户的数组数据等于 表格选择后的数据
        tableSelected(item) {
            for (var i = 0; i < item.length; i++) {
                item[i].numNow = Number(item[i].numNow)
            }
            this.sendTransferItems = item;
        },
        //正式过户
        transfer() {
            if (this.sendTransferItems.length === 0) {
                this.$message({
                    type: 'info',
                    message: '请选择要过户的资源'
                });
                return;
            }
            this.getTransferInfo(this.beforehandId).then(() => {
                this.transferFormData = this.$store.state.preTransfer.preTransferInfo;
                this.transferFormData.transferTime = new Date(this.transferFormData.transferTime);
                this.transferFormData.resItems = this.sendTransferItems;
                console.log(this.transferFormData);
                this.showTransferForm = true;
            });
        },
        // 表格编辑
        edit(params) {
            this.sendSonTransferId = params;
            let _self = this;
            _self.loading = true;
            this.getTransferInfo(params).then(() => {
                //添加资源时需要的id
                _self.transferId = params;
                _self.getTransferInfoResList(params).then(() => {
                    let obj = {
                        title: '编辑预过户信息',
                        dialog: true,
                        showEdit: true
                    }
                    _self.$store.dispatch('ptf_changDialog', obj);
                    _self.loading = false;
                }, () => {
                    _self.loading = false;
                })

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
                        biz_module: 'wmsStockTransferService',
                        biz_method: 'deleteTransfer',
                        biz_param: {
                            id: params,
                            beforehand: 1, //删除预过户
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
                _self.$store.dispatch('ptf_deletePreTransfer', obj).then(() => {
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
            if (column.label && column.label != '操作') {
                this.loading2 = true;
                //当前行的列表信息
                let id = row.id;
                let _self = this;
                if (id) {
                    this.beforehandId = id;
                    this.getTransferInfoResList(id).then(() => {
                        let userName = this.$store.state.user.user.name;
                        if (row.createrName === userName) {
                            this.btnValidate = true;
                        } else {
                            this.btnValidate = false;
                        }
                    }, () => {
                        this.btnValidate = false;
                    })
                } else {
                    this.btnValidate = false;
                    _self.formData.stockInItems = [];
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
                _self.$store.dispatch('ptf_getPreTransferList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        //根据ID获取头部信息
        getTransferInfo(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loading = true;
                let params = {
                    id: paramsId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockTransferService',
                        biz_method: 'queryTransferInfo',
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
                _self.$store.dispatch('ptf_getTransferInfo', obj).then(() => {
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
                _self.$store.dispatch('ptf_getResInfoList', obj).then(() => {
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
        editNum(index) {
            this.unDisabled = index;
            this.transferItems[index].numNow = '';
        },
        //dialog关闭时的回调
        dialogClose() {
            this.$store.dispatch('ptf_changDialog', {});
        },
        editGetHttp(paramsId) {
            this.getHttp().then(() => {
                this.getTransferInfoResList(paramsId.id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                })
            })
        }

    }
}
</script>
