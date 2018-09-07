<template>
    <div class="detail">
        <!-- 头部sort -->
        <searchHeader :options="locationList" :formData="formData" v-on:search="search"></searchHeader>
        <!-- 表格 -->
        <div class="table">
            <el-table :data="detailList" border stripe style="width: 100%" v-loading="loading">
                <el-table-column label="资源图片" width="130" >
                    <template scope="scope">
                        <div v-if="scope.row.imageArray.length>0" :disabled="scope.row.imageArray.length == 0" @click="onShowImg(scope.$index)" type="text" icon="picture">
                            <img :src='item' v-for='item in scope.row.imageArray'/>
                        </div>
                        <div v-else>
                            无图
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="storageDate" label="入库日期" width="120">
                    <template scope="scope">
                        <span>{{scope.row.storageDate | filterTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stockTime" label="在库时间" width="120" >
                    
                </el-table-column>
                <el-table-column prop="customerName" label="货主名称" width="120">
                </el-table-column>
                <el-table-column prop="contactName" label="联系人" width="100">
                </el-table-column>
                <el-table-column prop="contactPhone" label="联系方式" width="140">
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
                <el-table-column prop="locationName" label="产地" width="120">
                    <template scope="scope">
                        <span>{{scope.row.locationName | filterLocation}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="depotName" label="仓库" width="120">
                </el-table-column>
                 <el-table-column prop="depotName" label="仓库所在地" width="120">
                </el-table-column>
                <el-table-column prop="siteName" label="库位" width="90">
                </el-table-column>
                <el-table-column prop="total" label="总量" width="120">
                </el-table-column>
                <el-table-column  label="锁定库存" width="120">
                    <template scope="scope">
                     <el-button  @click='showDetail(scope.row.id)'  type="text" size="small">{{scope.row.total}}</el-button>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="freezeNum" label="单位" width="80">
                    <template scope="scope">
                        <span>{{scope.row.unitId | filterUnit}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="depotType" label="库存类型" width="100">
                </el-table-column>
                 <el-table-column prop="depotType" label="库存来源" width="100">
                </el-table-column>
                <el-table-column prop="batchNo" label="入库单号" width="190">
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pages clearfix">
            <el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="  total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- 图片展示 -->
        <el-dialog size="tiny" style="text-align:center" title="资源图片展示" v-model="showImg">
            <resImgShow :imageArray="imageArray"></resImgShow>
        </el-dialog>

        <el-dialog title="锁定库存相关信息" :visible.sync="detailShow">
        <el-table :data="stockLockList">
            <el-table-column property="relateEmployee" label="相关业务员" width="100"></el-table-column>
            <el-table-column property="adoptNumber" label="采用库存数量" width="100"></el-table-column>
            <el-table-column property="employeePhone" label="联系电话" width="100"></el-table-column>
            <el-table-column property="offerId" label="相关报价ID" width="200"></el-table-column>
            <el-table-column property="preOrderId" label="相关预审单ID" width="200"></el-table-column>
            <el-table-column property="orderId" label="相关销售订单ID" width="250"></el-table-column>
        </el-table>
        </el-dialog>
    </div>
</template>
<script>
import httpService from '../../../common/httpService'
import searchHeader from '../../../components/detail/searchHeader'
import resImgShow from '../../../components/resImgShow.vue'
import api from '../../../common/api.js'
export default {
    name: 'detail-view',
    data() {
        return {
            stockLockList:[],
            detailShow:false,
            gridData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }],
            locationList: [],
            showImg: false,
            imageArray: [],
            loading: false,
            formData: {
                breedId: '',
                breedName: '',
                depotType: '',
                batchNo: '',
                location: '',
                depotId: '',
                depotName: '',
                siteId: '',
                siteName: '',
                customerId: '',
                customerName: '',
                contactName: '',
                contactPhone: '',
                beginTime: '',
                endTime: '',
                validate: '',
                societyDepotType: '社会库存',
                // isList: 'isList',
                page: 1,
                pageSize: 10
            }
        }
    },
    computed: {
        detailList() {
            return this.$store.state.detail.det_storeList.list;
        },
        total() {
            return this.$store.state.detail.det_storeList.total;
        }
    },
    mounted() {
        this.getHttp();
        if (this.$store.state.search.locationList.length === 0) {
            this.getLocationList();
        } else {
            this.locationList = this.$store.state.search.locationList;
        }
    },
    components: {
        searchHeader,
        resImgShow
    },
    methods: {
        showDetail(id){
           
            let body = {
                    biz_module: 'wmsStockService',
                    biz_method: 'queryStockFreezeDetail',
                    biz_param: {
                        id:id
                    }
                };
            api.commonPOST(body).then(res =>{
                this.stockLockList  = res.biz_result.list
               this.detailShow = true
            })
            console.log(id)
        },
        //展示图片组件
        onShowImg(index) {
            this.imageArray = this.detailList[index].imageArray;
            this.showImg = true;
        },
        getHttp() {
            this.loading = true;
            let _self = this;
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                    biz_module: 'wmsStockService',
                    biz_method: 'queryStockList',
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
            _self.$store.dispatch('det_getStoreList', obj).then(() => {
                _self.loading = false;
            }, () => {
                _self.loading = false;
            });
        },
        search(params) {
            if (params.type === 'clear') {
                this.formData = {
                    breedId: '',
                    breedName: '',
                    depotType: '',
                    batchNo: '',
                    location: '',
                    depotId: '',
                    depotName: '',
                    siteId: '',
                    siteName: '',
                    customerId: '',
                    customerName: '',
                    contactName: '',
                    contactPhone: '',
                    beginTime: '',
                    endTime: '',
                    validate: '',
                    societyDepotType: '社会库存',
                    // isList: 'isList',
                    page: 1,
                    pageSize: 10
                }
            }
            this.getHttp();
        },
        // 分页事件        
        handleCurrentChange(val) {
            this.formData.page = val;
            this.getHttp();
        },
        //获取药材产地
        getLocationList() {
            let _self = this;
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'breedService',
                biz_method: 'queryBreedLocalList',
                biz_param: {}
            };
            //加密处理接口          
            let obj = {
                body: body,
                path: url
            }
            _self.loading = true;
            _self.$store.dispatch('getLocationList', obj).then((res) => {
                this.locationList = res.biz_result.list
                _self.loading = false;
            }, () => {
                _self.loading = false;
            });
        }
    }

}
</script>
<style lang="less" scoped>
// 库存明细模块
.detail {
    width: 100%;
    .table {
        width: 100%;
    }
    .pages {
        width: 100%;
        height: 60px;
        overflow: hidden;
        margin: auto;
        text-align: center;
    }
}
</style>
