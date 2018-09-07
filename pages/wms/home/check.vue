<style lang="less" scoped>
// 盘点管理
.check {
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
    .title {
        padding: 10px;
        border: 1px solid #4DB3FF;
        background-color: #EEF8FC;
        border-radius: 4px;
        margin: 10px 0;
    }
}
</style>
<template>
    <div class="check">
    <div v-if='mainListShow'>
        <searchHeader  :formData="formData" v-on:search="search" @addRecord='addRecord' ></searchHeader>
        <!-- 表格 -->
        <div class="table">
            <el-table highlight-current-row :data="tableData" border stripe style="width: 100%" v-on:row-click="tableInfoSelect" v-loading="loading">
                 <el-table-column prop="checkNo" label="盘点单号" width="240">
                </el-table-column>
                <el-table-column prop="ctime" label="盘点时间" width="240" >
                    <template scope="scope">
                        <span>{{scope.row.storageDate | filterTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="checkBreed" label="盘点品种" width="200">
                </el-table-column>
                <el-table-column prop="checkDepot" label="盘点仓库" width="200">
                </el-table-column>
                <el-table-column  label="状态" width="240">
                        <template scope="scope">
                                <span>{{scope.row.validate | filterStockState}}</span>
                            </template>
                    </el-table-column>
                <el-table-column prop="creater" label="创建人" width="200">
                </el-table-column>
                <el-table-column label="操作" width="240">
                        <template scope="scope">
                             
                              <el-button  v-if='scope.row.validate == 0||scope.row.validate == -4'   type="text" size="small">编辑</el-button>
                              <el-button v-else    type="text" size="small">详情</el-button>
                        </template>
                    </el-table-column>
                
                
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" :current-page="formData.page" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
        
        
    </div>
</template>
<script>
import searchHeader from '../../../components/check/searchHeader.vue'
import addSearchHeader from '../../../components/check/addSearchHeader.vue'
import subSearchHeader from '../../../components/check/subSearchHeader.vue'
import httpService from '../../../common/httpService.js'
import resImgShow from '../../../components/resImgShow.vue'
import depot from '../../../components/search/depot.vue'
import breed from '../../../components/search/breed.vue'
import api from '../../../common/api.js'
export default {
    name: 'check-view',
    data() {
        return {
            tableData:[],
            total:0,
            mainListShow:true,
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
                page: 1,
                pageSize: 10
            },
        }
    },
   
    components: {
        searchHeader,
        subSearchHeader,
        depot,
        breed,
        addSearchHeader,
        subSearchHeader,
        resImgShow
    },
    mounted() {
       this.getCheckList('main')
    },
    methods: {
        //搜索盘点列表
        search(){
            this.getCheckList('main')
        },
        //盘点列表分页
        handleCurrentChange(val) {
            this.formData.page = val;
            this.getCheckList('main').then(res => {
                 this.loading2 = false;
            })
               
            
        },
        //获取盘点列表
        getCheckList(option){
            let body = {
                    biz_module: 'wmsStockService',
                    biz_method: 'queryStockList',
                     biz_param: this.formData
                };
            api.commonPOST(body).then(res =>{
                
                    this.tableData = res.biz_result.list
                    this.total = res.biz_result.total
                    console.log(this.tableData)
               
                
            })
        },
       
    }
}
</script>
