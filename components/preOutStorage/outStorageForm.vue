<!--  出库表单 -->
<style lang="less" scoped>
.newOutStorageForm {
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
    <div class="newOutStorageForm">
        <h2>生成出库单</h2>
        <div class="form_wrap">
            <el-col :span="24">
                <div class="title clearfix">
                    <h3 class="fl">操作信息</h3>
                    <div class="fr">
                        <!--<el-button size="small" @click="save('formData')" type="primary">确认生成出库单</el-button>-->
                        <el-button size="small" icon="close" v-on:click="back">&nbsp;取消</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="form">
                <el-form ref="formData" :rules="rules" :model="formData" label-width="110px" label-position="center" v-loading.fullscreen.lock="loading">
                <send  @delivery-success="getHttp" @send = 'confirmSend'></send>
                   
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="table">
                    <el-table align="center" empty-text="资源列表为空,请返回选取资源" max-height="400" :data="formData.resItems" border stripe style="width:100%">
                        <el-table-column prop="breedName" label="品名" width="120">
                        </el-table-column>
                        <el-table-column label="规格" width="200">
                            <template scope="scope">
                                <span v-if="scope.row.specAttribute[scope.row.breedName]">
                                           {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                                        </span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="产地" min-width="100">
                            <template scope="scope">
                                <span>{{scope.row.locationName | filterLocation}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="unitId" label="单位" width="80">
                            <template scope="scope">
                                <span>{{scope.row.unitId | filterUnit}}</span>
                            </template>
                        </el-table-column>
                         <el-table-column prop="price" label="单价" width="120">
                        </el-table-column>
                        <el-table-column prop="siteName" label="库位" width="120">
                        </el-table-column>
                        <el-table-column prop="breedName" label="应出库数量" width="120">
                        </el-table-column>
                        <el-table-column label="本次出库数量" width="140">
                            <template scope="scope">
                                <myInput :stockId="scope.row.stockId" :maxNum="scope.row.numUn" v-model="scope.row.num"></myInput>
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
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import customer from '../../components/editSearch/customer.vue'
import depot from '../../components/editSearch/depot.vue'
import myInput from '../myInput.vue'
import usableNum from '../usableNum.vue'
import imageUpload from '../imageUpload.vue'
import send from '../../components/outStorage/send.vue'
export default {
    name: 'outStorageForm',
    props: ['formData'],
    data() {
        return {
            logisticsInfo:{},
            imageArray:[],
            param: {
                keyName: 'yaocai'
            },
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loading: false,
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
                consigneeName: [{
                    required: true,
                    message: '提货人不能为空',
                    trigger: 'blur,change'
                }],
                consigneePhone: [{
                    required: true,
                    pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
                    message: '请输入合法的手机号',
                    trigger: 'blur'
                }],
                outTime: [{
                    required: true,
                    type: 'date',
                    message: '请选择预入库时间',
                    trigger: 'blur,change'
                }],
            },
        }
    },
    components: {
        depot,
        imageUpload,
        customer,
        myInput,
        send,
        usableNum
    },
    
    methods: {
        confirmSend(param){
            this.logisticsInfo = param.param
            this.save('formData')
            console.log('confor------------',param)
        },
         getImgUrl(params) {
            this.imageArray.push(params);
            
        },
        addRes() {
            //获取该用户名 该仓库下的资源
            let _self = this;
            this.getHttp().then(() => {
                let obj = {
                    dialog: true
                }
                 _self.$store.dispatch('put_changDialog', obj);
            })
        },
        //删除资源列表信息
        deleteList(index) {
            this.$confirm('确定删除该条资源吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.formData.resItems.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        save(formName) {
            let _self = this;
            let arr = [];
            for (var i = 0; i < _self.formData.resItems.length; i++) {
                let src = _self.formData.resItems[i];
                let sendObj = {};
                // if (src.usableNum <= 0) {
                //     this.$message({
                //         type: 'info',
                //         message: '有的资源可用数量不足,不能转正式出库'
                //     });
                //     return;
                // }
                // if (Number(src.num) > src.usableNum) {
                //     this.$message({
                //         type: 'info',
                //         message: '出库数量不能大于资源可用量,请重新编辑'
                //     });
                //     return;
                // }
                // if (Number(src.num) <= 0) {
                //     this.$message({
                //         type: 'info',
                //         message: '出库资源数量不能为少于0,请重新编辑'
                //     });
                //     return;
                // }
                // if (Number(src.num) > src.numUn) {
                //     this.$message({
                //         type: 'info',
                //         message: '出库数量不能大于剩余数量,请编辑'
                //     });
                //     return;
                // }
                sendObj.stockId = src.stockId;
                sendObj.beforehandItemId = src.id;
                sendObj.num = Number(src.num);
                arr.push(sendObj);
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _self = this;
                    this.$confirm('确定正式出库吗?', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 处理出库详情资料                      
                        let sendData = {
                            beforehandId: _self.formData.id,
                            comment: _self.formData.comment,
                            stockOutItems: arr
                        }
                        sendData = Object.assign(sendData,this.logisticsInfo)
                        let url = httpService.urlCommon + httpService.apiUrl.most;
                        let body = {
                            biz_module: 'wmsStockOutService',
                            biz_method: 'addStockOutByBeforehand',
                            biz_param: sendData
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
                        _self.loadingInfo = true;
                        _self.$store.dispatch('put_perToOutStorage', obj).then(() => {
                            _self.loadingInfo = false;
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.push('/wms/home/outStorage');
                        }, () => {
                            _self.loadingInfo = false;
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        back() {
            this.$emit('showOutStorage', {
                showOutStorageForm: false
            })
        },
        getDepot(params) {
            this.formData.depotId = params.id;
            this.formData.depotName = params.name;
        },
        getCustomer(params) {
            this.formData.contactName = params.contactName; //货主联系人名称
            this.formData.contactPhone = params.contactPhone //联系人手机
            this.formData.customerId = params.id;
            this.formData.customerName = params.name;
        },
        //获取指定用户ID 指定仓库下的资源
        getHttp(page) {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loading = true;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let sendParams = {
                    breedId: '',
                    depotType: '',
                    batchNo: '',
                    location: '',
                    depotId: _self.formData.depotId, //_self.formData.depotId
                    siteId: '',
                    customerId: _self.formData.customerId,
                    beginTime: '',
                    endTime: '',
                    page: 1,
                    pageSize: 10
                };
                let body = {
                    biz_module: 'wmsStockService',
                    biz_method: 'queryStockList',
                    biz_param: sendParams
                };
                //加密处理接口
                url = httpService.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                let obj = {
                    body: body,
                    path: url
                };
                _self.$store.dispatch('put_getPreOutStoList', obj).then(() => {
                    _self.loading = false;
                    resolve();
                }, () => {
                    _self.loading = false;
                    reject();
                });
            })
        },
    }
}
</script>
