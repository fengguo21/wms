<!-- 预入库 入库表单 -->
<style lang="less" scoped>
.newInStorageForm {
    position: relative;
    margin: 10px 20px;
    padding: 0 20px;
    background-color: #fff;
    h2 {
        text-align: center;
        font-size: 20px;
        font-weight: 700;
    }
    .form_wrap {
        width: 80%;
        margin: auto;
    }
    .form {
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #FAFAFA;
        border-radius: 4px;
    }
    .title {
        padding: 10px;
        border: 1px solid #4DB3FF;
        background-color: #EEF8FC;
        border-radius: 4px;
        margin: 10px 0;
    }
    .table {
        margin-top: 10px;
    }
}
</style>
<template>
    <div class="newInStorageForm">
        <h2>生成入库单</h2>
        <div class="form_wrap">
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">操作信息</h3>
                    <div class="fr">
                        <el-button :disabled="sendIng" size="small" @click="save('formData')" type="primary">确认生成入库单</el-button>
                        <el-button size="small" icon="close" v-on:click="back">&nbsp;取消</el-button>
                    </div>
                </div>
            </el-col>
            
            <!--  <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">资源列表</h3>
                    <el-button class="fr" size="small" @click="add" type="primary" icon="plus">立即添加</el-button>
                </div>
            </el-col> -->
            <el-col :span="24">
                <div class="table">
                    <el-table align="center" empty-text="资源列表为空,请添加资源" max-height="400" :data="formData.resItems" border stripe style="width: 100%;">
                        <!--<el-table-column label="操作" fixed="left" width="80">
                            <template scope="scope">
                                <el-button size="small" @click="deleteList(scope.$index)" type="text" icon="delete2"></el-button>
                            </template>
                        </el-table-column>-->
                        <el-table-column prop="breedName" label="品名" width="140">
                        </el-table-column>
                        <el-table-column prop="unitId" label="单位" width="120">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                         <el-table-column prop="price" label="单价" width="160">
                        </el-table-column>
                        <el-table-column prop="numUn" label="应入数量" width="160">
                        </el-table-column>
                        <el-table-column label="本次入库数量" width="200">
                            <template scope="scope">
                                <myInput v-model="scope.row.num" ></myInput>
                            </template>
                        </el-table-column>
                        <el-table-column prop="siteName" label="入库库位" >
                            <template scope="scope">
                                <el-select size="small" v-model="scope.row.siteId" filterable placeholder="请选择">
                                    <el-option v-for="item in sites" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column  label="总价值" width="140">
                         <template scope="scope">
                                <span>{{scope.row.price*scope.row.num}}元</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </div>
        <!--  <el-dialog style="text-align:center" title="添加资源" v-model="dialog">
            <addResource v-if="dialog" v-on:addList="addList" v-on:showChange="showChange"></addResource>
        </el-dialog> -->
    </div>
</template>
<script>
// import addResource from './addResource.vue'
import httpService from '../../common/httpService.js'
import customer from '../editSearch/customer.vue'
import depot from '../editSearch/depot.vue'
import myInput from '../myInput.vue'
export default {
    name: 'nStorageForm',
    props: ['formData'],
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loading: false,
            unDisabled: -1,
            dialog: false,
            rules: {
                customerId: [{
                    required: true,
                    type: 'number',
                    message: '货主名称不能为空',
                    trigger: 'blur,change'
                }],
                depotId: [{
                    required: true,
                    type: 'number',
                    message: '仓库不能为空',
                    trigger: 'blur,change'
                }],
                inTime: [{
                    required: true,
                    type: 'date',
                    message: '请选择预入库时间',
                    trigger: 'blur,change'
                }],
            },
            sendIng: false
        }
    },
    computed: {
        sites() {
            return this.$store.state.search.siteList
        }
    },
    components: {
        // addResource,
        depot,
        customer,
        myInput
    },
    methods: {
        add() {
            this.dialog = true;
        },
        showChange() {
            this.dialog = false;
        },
        //删除资源列表信息
        deleteList(index) {
            this.$confirm('确定删除该条资源吗', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.formData.resItems.splice(index, 1);
                this.$message({
                    type: 'info',
                    message: '删除成功'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        addList(params) {
            this.formData.resItems.push(params);
            this.dialog = false;
            this.$message({
                type: 'success',
                message: '添加成功'
            });
        },
        save(formName) {
            let _self = this;
            // 处理入库详情资料
            let arr = [];
            for (var i = 0; i < _self.formData.resItems.length; i++) {
                let sendObj = {};
                sendObj.beforehandItemId = _self.formData.resItems[i].id;
                sendObj.num = Number(_self.formData.resItems[i].num);
                if (sendObj.num <= 0) {
                    this.$message({
                        type: 'info',
                        message: '资源数量不能为0'
                    });
                    return;
                }
                
                if (!_self.formData.resItems[i].siteId) {
                    this.$message({
                        type: 'info',
                        message: '请选择库位点'
                    });
                    return;
                }
                sendObj.breedId = _self.formData.resItems[i].breedId;
                sendObj.unitId = _self.formData.resItems[i].unitId;
                sendObj.siteId = _self.formData.resItems[i].siteId;
                sendObj.location = _self.formData.resItems[i].location;
                sendObj.imageArray = _self.formData.resItems[i].imageArray;
                sendObj.specAttribute = _self.formData.resItems[i].specAttribute;
                arr.push(sendObj);
            };
            console.log(this.$refs[formName],'============')
           
              
                    this.$confirm('确定正式入库吗', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let formDataObj = {
                            beforehandId: _self.formData.id,
                            stockInItems: arr,
                                                   
                        }
                        let url = httpService.urlCommon + httpService.apiUrl.most;
                        let body = {
                                biz_module: 'wmsStockInService',
                                biz_method: 'addStockInByBeforehand',
                                biz_param: formDataObj
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
                        _self.loading = true;
                        _self.$store.dispatch('pre_addStockIn', obj).then(() => {
                            _self.loading = false;
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.push('/wms/home/putInStorage');
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
        back() {
            this.$emit('changeShowPutInEditForm', {
                showPutInEditForm: false,
            })
        },
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
        },
        getCustomer(params) {
            this.formData.customerId = params.id;
            this.formData.customerName = params.name;
            this.formData.contactName = params.contactName;
            this.formData.contactPhone = params.contactPhone;
        },
    }
}
</script>
