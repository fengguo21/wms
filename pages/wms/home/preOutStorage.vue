<style lang="less" scoped>
// 预出库管理
.preOutStorage {
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
        <div class="preOutStorage" v-if="!isFormShow && showOutStorageForm === false">
            <div v-if='loading2 == false'>
                <searchHeader v-on:search="search" :formData="formData" v-on:changeForm="changeForm"></searchHeader>
            <!-- 表格 -->
            <div class="table">
                <el-table highlight-current-row :data="tableData" v-on:row-click="getResInfoList" border stripe style="width: 100%; margin: auto" v-loading="loading">
                    <el-table-column label="操作" width="120">
                        <template scope="scope">
                             <el-button  v-on:row-click="getResInfoList"  type="text" size="small">详情</el-button>
                        </template>
                    </el-table-column>
                    
                    <el-table-column  label="状态" width="120">
                        <template scope="scope">
                                <span>{{scope.row.status | filterStockState}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column label="预出库日期" width="160">
                        <template scope="scope">
                            <span>{{scope.row.outTime | filterTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="supplyCompany" label="供货单位" width="120">
                    </el-table-column>
                    <el-table-column prop="customerName" label="客户名称" width="120">
                    </el-table-column>
                     <el-table-column prop="customerName" label="发货要求" width="120">
                    </el-table-column>
                     <el-table-column prop="customerName" label="发货备注" width="120">
                    </el-table-column>
                    <el-table-column prop="breedNames" label="品种" width="120">
                    </el-table-column>
                    <el-table-column prop="preOutBreedNum" label="预出库品种数" width="120">
                    </el-table-column>
                    <el-table-column prop="alreadyOutBreedNum" label="已出库品种数" width="120">
                    </el-table-column>
                    
                    <el-table-column prop="depotName" label="仓库名称" width="120">
                    </el-table-column>
                    <el-table-column prop="source" label="出库类型" width="120">
                        <template scope="scope">
                            <span v-if="scope.row.source == 0">货主出货</span>
                            <span v-if="scope.row.source == 1">销售出货</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="comment" label="备注" min-width="250">
                    </el-table-column>
                    <el-table-column prop="id" label="申请出库单号" width="120">
                    </el-table-column>
                    <el-table-column prop="id" label="相关销售订单ID" width="120">
                    </el-table-column>
                </el-table>
            </div>
             <!-- 分页 -->
            <div class="pages">
                <el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            </div>
            
            <el-dialog size="large" v-on:close="dialogClose" style="text-align:center" :title="dialog.title" v-model="dialog.dialog">
                <editOutStorageInfo v-if="dialog.showEdit" v-on:newGetHttp="newGetHttp"></editOutStorageInfo>
                <addResource :type="'edit'" v-if="dialog.showAdd"></addResource>
            </el-dialog>
           
            <!-- 表格2 -->
            <div style="text-align: center" v-show="!loading2">
                <span>选中表格获取资源信息......</span>
            </div>
            <div class="table_bot clearfix" v-show="loading2">
                <el-col :span="3">
                    <div class="btn_wrap">
                        <el-button v-if="btnValidate" @click="outStorage" size="small" type="primary">正式出库</el-button>
                        <el-button v-if="btnValidate" @click="deletePound" size="small" type="primary" icon="delete2">删除磅差</el-button>
                    </div>
                </el-col>
                 <h3>详情：</h3>
                <el-col :span="24">
                   <sub-search-header v-on:search="subSearch" :searchParam="searchParam" @stockOut='outStorage' v-on:closeDetail="closeDetail"></sub-search-header>
                </el-col>
                <el-col :span="24">
                    <el-table align="center" empty-text="当前资源已经全部出库,或资源信息为空" v-on:selection-change="tableSelected" max-height="400" :data="tableInfoList" border stripe style="width: 100%;" v-loading="loadingInfo">
                        <el-table-column :selectable="debCheckBox" type="selection" width="50" >
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
                        <el-table-column label="应出库数量" prop="num" width="140">
                            
                        </el-table-column>
                        <el-table-column prop="numEd" label="实出库数量" width="140">
                        </el-table-column>
                        <el-table-column label="预出库数量" width="140">
                            <template scope="scope">
                                <myInput :disabled="!btnValidate" :maxNum="scope.row.numUn" v-model="scope.row.num"></myInput>
                            </template>
                        </el-table-column>
                       <el-table-column  label="状态" width="140">
                            <template scope="scope">
                                <span>{{scope.row.state | filterStockState}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="numEd" label="包装" width="140">
                        </el-table-column>
                        <el-table-column prop="numEd" label="件重" width="140">
                        </el-table-column>
                        <el-table-column prop="numEd" label="采购/加工日期" width="140">
                        </el-table-column>
                        <el-table-column prop="comment" label="备注" width="140">
                        </el-table-column>
                        
                    </el-table>
                </el-col>
            </div>
        </div>
        <div v-if="isFormShow && showOutStorageForm === false">
            <newOutStorageForm :beforehand="1" v-on:changeForm="changeForm"></newOutStorageForm>
        </div>
        <!-- 正式出库 -->
        <div v-if="showOutStorageForm">
            <outStorageForm :formData="outStorageData" v-on:showOutStorage="showOutStorage"></outStorageForm>
        </div>
        <!-- 图片展示 -->
        <el-dialog size="tiny" style="text-align:center" title="资源图片展示" v-model="showImg">
            <resImgShow :imageArray="imageArray"></resImgShow>
        </el-dialog>
    </div>
</template>
<script>
import searchHeader from '../../../components/preOutStorage/searchHeader.vue'
import editOutStorageInfo from '../../../components/preOutStorage/editOutStorageInfo.vue'
import httpService from '../../../common/httpService.js'
import addResource from '../../../components/preOutStorage/addResource.vue'
import newOutStorageForm from '../../../components/newOutStorageForm.vue'
import myInput from '../../../components/myInput.vue'
import outStorageForm from '../../../components/preOutStorage/outStorageForm.vue'
import resImgShow from '../../../components/resImgShow.vue'
import subSearchHeader from '../../../components/preOutStorage/subSearchHeader.vue'

import {
    filterUnit,filterStockState
} from '../../../filters/index.js'
export default {
    name: 'preOutStorage-view',
    data() {
        return {
             searchParam:{
                breedName:'',
                state:'',
                id:''
            },
            showImg: false,
            imageArray: [],
            isFormShow: false,
            showOutStorageForm: false,
            btnValidate: false,
            outStorageData: {
                resItems: []
            },
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
            sendOutStorageItems: [],
            unDisabled: -1
        }
    },
    computed: {
       
        tableData() {
            return this.$store.state.preOutStorage.putOutStoList.list;
        },
        total() {
            return this.$store.state.preOutStorage.putOutStoList.total;
        },
        dialog() {
            return this.$store.state.preOutStorage.dialog;
        },
        tableInfoList() {
            let arr = this.$store.state.preOutStorage.putTableInfoList.stockOutItems;
            let newArr = [];
            for (var key in arr) {
                if (arr[key].numUn > 0) {
                    newArr.push(arr[key]);
                }
            }
            return newArr;
        },
    },
    components: {
        searchHeader,
        subSearchHeader,
        editOutStorageInfo,
        addResource,
        newOutStorageForm,
        myInput,
        outStorageForm,
        
        resImgShow
    },
    mounted() {
        this.getHttp();
    },
    methods: {
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
        },
         closeDetail(){
            this.loading2 = false
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
         //二级搜索
        subSearch(){
            this.getInfoListById()
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
        debCheckBox(row, index) {
            if (row.numNow === 0 || row.numUn <= 0) {
                return false;
            } else {
                return true;
            }
        },
        //展示图片组件
        onShowImg(index) {
            this.imageArray = this.tableInfoList[index].imageArray;
            this.showImg = true;
        },
        showOutStorage(params) {
            this.showOutStorageForm = params.showOutStorageForm;
        },
        dialogClose() {
            this.$store.dispatch('put_changDialog', {});
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
        //勾选预出库数组数据等于 表格选择后的数据
        tableSelected(item) {
            for (var i = 0; i < item.length; i++) {
                item[i].numNow = Number(item[i].numNow);
            }
            this.sendOutStorageItems = item;
        },
        //编辑保存后 从新获取列表数据
        newGetHttp() {
            this.getHttp();
        },
        //正式出库
        outStorage() {
            if (this.sendOutStorageItems.length === 0) {
                this.$message({
                    type: 'info',
                    message: '请选择要出库的资源'
                });
                return;
            }
            
            this.outStorageData = this.$store.state.preOutStorage.putTableInfoList;
            this.outStorageData.resItems = this.sendOutStorageItems;
            this.outStorageData.outTime = new Date(this.outStorageData.outTime);
            this.sendOutStorageItems = [];
            this.showOutStorageForm = true;
        },
        
        

        //获取资源信息列表 通过表格
        getResInfoList(row, event, column) {
            if (column.label) {
                this.loading2 = true;
                //当前行的列表信息
                let id = row.id;
                let _self = this;
                if (id) {
                    
                    this.beforehandId = id;
                    this.searchParam.id = id
                    this.send(this.searchParam)
                    this.getInfoListById().then(() => {
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
                        biz_method: 'queryStockOutBeforehand',
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
                _self.$store.dispatch('put_getPreOutStoTabList', obj).then(() => {
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
                    id: this.searchParam.id,
                    breedName:this.searchParam.breedName,
                    state:this.searchParam.state

                }
                
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsStockOutService',
                        biz_method: 'queryStockOutByIdBeforehand',
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
                _self.$store.dispatch('put_preTableInfoListById', obj).then(() => {
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
        }
    }
}
</script>
