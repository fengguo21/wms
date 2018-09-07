<style lang="less" scoped>
// 预入库管理
.preStorage {
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
         margin: auto;
        margin-top:40px;
        width: 100;
       
        padding-top: 10px;
        padding-bottom: 100px;
    }
}
</style>
<template>
    <div>
        <div class="preStorage" v-if="!isFormShow && showPutInEditForm === false">
            <searchHeader v-on:search="search" :formData="formData" v-on:changeForm="changeForm"></searchHeader>
            <!-- 表格 -->
            <div class="table">
                <el-table highlight-current-row :data="tableData" v-on:row-click="tableInfoSelect" border stripe style="width: 100%; margin: auto" v-loading="loading">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-button  v-on:row-click="tableInfoSelect"  type="text" size="small">入库</el-button>
                           <!--<el-button :disabled="!validate(scope.row.createrName)" @click="edit(scope.row.id)" type="text" size="small">编辑</el-button>
                            <el-button :disabled="!validate(scope.row.createrName)" @click="del(scope.row.id)" type="text" size="small">删除</el-button>-->
                        </template>
                    </el-table-column>
                     <el-table-column prop="createrName" label="预入库单号" width="120">
                    </el-table-column>
                     <el-table-column  label="状态" width="120">
                        <template scope="scope">
                                <span>{{scope.row.state | filterStockState}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column prop="createrName" label="创建人" width="120">
                    </el-table-column>
                    <el-table-column label="预入库日期" width="160">
                        <template scope="scope">
                            <span>{{scope.row.inTime | filterTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerName" label="货主名称" width="220">
                    </el-table-column>
                     <el-table-column prop="customerName" label="供应商" width="220">
                    </el-table-column>
                    <el-table-column prop="contactName" label="联系人" width="120">
                    </el-table-column>
                    <el-table-column prop="contactPhone" label="联系电话" width="140">
                    </el-table-column>
                    <el-table-column prop="depotName" label="仓库名称" width="160">
                    </el-table-column>
                     <el-table-column prop="source" label="入库来源" min-width="120">
                        <template scope="scope">
                            <span v-if="scope.row.source ==0">货主入库</span>
                                <span v-if="scope.row.source ==1">采购入库</span>
                        </template>
                    </el-table-column>
                     <el-table-column  label="物流状态" width="160">
                     <template scope="scope">
                            <el-button  @click='viewLogistics(scope.row.id)'  type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="depotType" label="库存类型" width="150">
                    </el-table-column>
                    
                    <el-table-column prop="comment" label="备注" min-width="220">
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pages">
                <el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <el-dialog size="large" style="text-align:center" :title="dialog.title" v-model="dialog.dialog">
                <!--<editStockInfo v-if="dialog.showEdit" v-on:clearData="clearData" v-on:editGetHttp="editGetHttp"></editStockInfo>-->
                <handle-storage v-if="dialog.showEdit" v-on:clearData="clearData" v-on:editGetHttp="editGetHttp"></handle-storage>
                <addResource type="preEdit" v-if="dialog.showAdd" :formData="resData"></addResource>
            </el-dialog>
            <!-- 表格2 -->
            <div style="text-align: center" v-show="!loading2">
                <span>选中表格获取资源信息......</span>
            </div>
            <div class="table_bot clearfix" v-show="loading2">
            <h3>详情：</h3>
                <el-col :span="24">
                   <sub-search-header v-on:search="subSearch" :searchParam="searchParam" @stockIn='stockIn' v-on:closeDetail="closeDetail"></sub-search-header>
                </el-col>
                <el-col :span="24">
                    <el-table align="center" empty-text="当前资源已经全部入库,或资源信息为空" v-on:selection-change="tableSelected" max-height="400" :data="stockInItems" border stripe style="width: 100%" v-loading="loadingInfo">
                        <el-table-column type="selection" :selectable="debCheckBox" width="50" v-if="btnValidate">
                        </el-table-column>
                       
                        <el-table-column prop="breedName" label="品名" width="120">
                        </el-table-column>
                        <el-table-column label="规格" width="100">
                            <template scope="scope">
                                <span v-if="scope.row.specAttribute[scope.row.breedName]">
                               {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                            </span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="产地" width="120">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" min-width="70">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                         <el-table-column prop="siteName" label="库位" width="140">
                        </el-table-column>
                        <el-table-column label="应入数量" prop="num" width="140">
                            
                        </el-table-column>
                        <el-table-column prop="numEd" label="实入数量" width="140">
                        </el-table-column>
                        <el-table-column prop="numUn" label="未入库数量" width="140">
                        </el-table-column>
                        <el-table-column prop="numShort" label="短缺" width="140">
                        </el-table-column>
                        <el-table-column prop="price" label="单价" width="140">
                        </el-table-column>
                        <el-table-column  label="状态" width="140">
                            <template scope="scope">
                                <span>{{scope.row.state | filterStockState}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="comment" label="备注" width="140">
                        </el-table-column>
                        
                    </el-table>
                </el-col>
            </div>
        </div>
        <div class="newInStorageForm" v-if="isFormShow && showPutInEditForm === false">
            <newInStorageForm :radio="0" v-on:changeForm="changeForm"></newInStorageForm>
        </div>
        <!-- 正式入库单 -->
        <div class="putInEditFrom" v-if="showPutInEditForm">
            <putInEditForm v-if="showPutInEditForm" :formData="putInEditFormData" v-on:changeShowPutInEditForm="changeShowPutInEditForm"></putInEditForm>
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
import putInEditForm from '../../../components/preStorage/putInEditForm.vue'
import searchHeader from '../../../components/preStorage/searchHeader.vue'
import subSearchHeader from '../../../components/preStorage/subSearchHeader.vue'
import editStockInfo from '../../../components/preStorage/editStockInfo.vue'
import handleStorage from '../../../components/preStorage/handleStorage.vue'
import addResource from '../../../components/preStorage/addResource.vue'
import newInStorageForm from '../../../components/newInStorageForm.vue'
import myInput from '../../../components/myInput.vue'
import resImgShow from '../../../components/resImgShow.vue'
import {
    filterUnit,filterStockState
} from '../../../filters/index.js'
import httpService from '../../../common/httpService.js'
import api from '../../../common/api.js'
export default {
    name: 'preStorage-view',
    data() {
        return {
            logisticsShow:false,
            logisticsInfo:[],
            showImg: false,
            imageArray: [],
            isFormShow: false,
            showPutInEditForm: false,
            btnValidate: false,
            putInEditFormData: {
                resItems: {}
            },
            loading: false,
            loading2: false,
            loadingInfo: false,
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
                inTime: '',
                inTimeStart: '',
                inTimeEnd: '',
                stockInItems: [],
                page: 1,
                btnValidate:true,
                pageSize: 10
            },
            searchParam:{
                breedName:'',
                state:'',
                id:''
            },
            beforehandId: '',
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
            return this.$store.state.preStorage.preStorageList.list;
        },
        total() {
            return this.$store.state.preStorage.preStorageList.total;
        },
        dialog() {
            return this.$store.state.common.dialog;
        },
        stockInItems() {
            let arr = this.$store.state.preStorage.stockInfo.stockInItems;
            let newArr = [];
            for (var key in arr) {
                if (arr[key].numUn > 0) {
                    newArr.push(arr[key]);
                }
            }
            return newArr;
        },
        //校验按钮级权限
        restrictions() {
            let arr = this.$store.state.user.menus;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name === '入库管理') {
                    for (var j = 0; j < arr[i].children.length; j++) {
                        if (arr[i].children[j].title === '预入库管理') {
                            let obj = arr[i].children[j].validate
                            console.log(obj);
                            return obj;
                        };
                    }
                }
            }
            return {
                '删除磅差': '',
            };
        }
    },
    components: {
        searchHeader,
        editStockInfo,
        addResource,
        newInStorageForm,
        myInput,
        putInEditForm,
        handleStorage,
        subSearchHeader,
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
        closeDetail(){
            this.loading2 = !this.loading2
        },

        //校验
        validate(createrName) {
            console.log(createrName)
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
                    inTime: '',
                    inTimeStart: '',
                    inTimeEnd: '',
                    stockInItems: [],
                    page: 1,
                    pageSize: 10
                }
            }
            this.getHttp('isSearch');
        },
        //二级搜索
        subSearch(){
            this.getStockInfo()
        },
        //禁用列表选择
        debCheckBox(row, index) {
            if (row.numNow === 0 || row.numUn === 0) {
                return false;
            } else {
                return true;
            }
        },
        //展示图片组件
        onShowImg(index) {
            this.imageArray = this.stockInItems[index].imageArray;
            this.showImg = true;
        },
        //展示正式入库单
        changeShowPutInEditForm(params) {
            this.showPutInEditForm = params.showPutInEditForm;
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
            for (var i = 0; i < item.length; i++) {
                item[i].numNow = Number(item[i].numNow);
            }
            this.sendStockInItems = item;
        },
        //正式入库
        stockIn() {
            if (this.sendStockInItems.length === 0) {
                this.$message({
                    type: 'info',
                    message: '请选择要入库的资源'
                });
                return;
            }
            //数据发送到子组件
            this.putInEditFormData = this.$store.state.preStorage.stockInfo;
            this.putInEditFormData.resItems = this.sendStockInItems;
            this.putInEditFormData.inTime = new Date(this.putInEditFormData.inTime);
            this.getSiteHttp(this.putInEditFormData.depotId).then(() => {
                this.showPutInEditForm = true;
            });
        },
        // 表格编辑
        edit(params) {
            let _self = this;
            this.getStockInfo(params).then(function() {
                _self.$store.dispatch('pre_InStorNewClearResList').then(() => {
                    let obj = {
                        dialog: true,
                        showEdit: true,
                        title: '编辑预入库信息'
                    }
                    _self.$store.dispatch('com_changeShowDialog', obj);
                })
            });
        },
        //表格删除
        del(params) {
            let _self = this;
            this.$confirm('确定删除该条资源信息吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockInService',
                    biz_method: 'deleteStockInBeforehand',
                    biz_param: {
                        id: params
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
                _self.$store.dispatch('deleteStock', obj).then(() => {
                    _self.formData.page = 1;
                    _self.getHttp().then(() => {
                        _self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                }, () => {
                    _self.loading = false;
                });

            }).catch(() => {
                _self.loading = false;
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //删除磅差
        deletePound() {
            let _self = this;
            if (this.sendStockInItems.length === 0) {
                this.$message({
                    type: 'info',
                    message: '请选择要删除磅差的资源'
                });
                return;
            }
            let arr = [];
            for (var i = 0; i < this.sendStockInItems.length; i++) {
                let obj = {};
                obj.numEd = this.sendStockInItems[i].numEd;
                obj.numIng = this.sendStockInItems[i].numIng;
                obj.id = this.sendStockInItems[i].id;
                arr.push(obj);
            }
            this.$confirm('确定删除选择资源的磅差吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _self.loading = true;
                // 删除磅差  
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockInService',
                        biz_method: 'deleteBeforehandDeviation',
                        biz_param: {
                            id: this.beforehandId,
                            stockInItems: arr
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
                _self.$store.dispatch('deletePound', obj).then(() => {
                    _self.loading = false;
                    //从新获取资源信息
                    _self.getStockInfo(_self.beforehandId).then(() => {
                        let obj = _self.$store.state.preStorage.stockInfo;
                        _self.formData.stockInItems = obj.stockInItems;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    });
                }, () => {
                    _self.loading = false;
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
                _self.loading = false;
            });

        },
        //显示 设置入库量表单
        editStockIn(index) {
            this.unDisable = index;
        },
        //获取资源信息
        tableInfoSelect(row, event, column) {
            if (column.label && column.label != '物流状态') {
                this.loading2 = true;
                //当前行的列表信息
                let id = row.id;
                let _self = this;
                if (id) {
                    this.searchParam.id = id
                    this.loadingInfo = true;
                    this.beforehandId = id;
                    let param = {id:id}
                    this.getStockInfo().then(() => {
                        let userName = this.$store.state.user.user.name;
                        if (row.createrName === userName) {
                            this.btnValidate = true;
                        } else {
                            this.btnValidate = false;
                        }
                    }, () => {
                        this.btnValidate = false;
                    });
                } else {
                    this.btnValidate = false;
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
                        biz_method: 'queryStockInBeforehand',
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
                _self.$store.dispatch('pre_getStorageList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
        //根据ID获取详细的预入库单信息
        getStockInfo() {
            let _self = this;
            return new Promise((resolve, reject) => {
                let params = {
                    id: this.searchParam.id,
                    breedName:this.searchParam.breedName,
                    state:this.searchParam.state

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
        //获取库位点ID
        getSiteHttp(paramsId) {
            let _self = this;
            return new Promise((resolve, reject) => {
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
                    resolve();
                }, () => {
                    reject();
                });
            });
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
                            message: '操作成功'
                        });
                    });
                })
            })
        }
    }
}
</script>
