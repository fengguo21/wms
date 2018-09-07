<!-- 编辑预过户表单 -->
<style lang="less" scoped>
.editMoverStorageInfo {
    .title {
        padding: 10px 0;
        width: 100%;
        .fl {
            height: 36px;
            line-height: 36px;
        }
    }
}
</style>
<template>
    <div class="editMoverStorageInfo">
        <el-form ref="formData" :model="formData" label-width="110px" label-position="center">
            <div class="title clearfix">
                <h3 class="fl">基本信息</h3>
                <div class="btn_wrap fr">
                    <el-button size="small" @click="save('formData')" type="primary" icon="check">保存</el-button>
                </div>
            </div>
            <el-col :span="8">
                <el-form-item label="移库单号">
                    <el-input disabled v-model="formData.no"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="移库时间">
                    <el-date-picker style="width: 100%" :picker-options="pickerOptions0" :clearable="false" v-model="formData.moveDate" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="移库备注">
                    <el-input v-model="formData.comment"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="货主名称">
                    <el-input disabled v-model="formData.customerName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人">
                    <el-input disabled v-model="formData.contactName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系方式">
                    <el-input disabled v-model="formData.contactPhone"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <h3 class="fl">仓库信息</h3>
            </el-col>
            <el-col :span="8">
                <el-form-item label="仓库名称">
                    <el-input disabled v-model="formData.depotName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="原库位">
                    <el-input disabled v-model="formData.oldSiteName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="新库位">
                    <el-input disabled v-model="formData.newSiteName"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-bottom: 10px;">
                <h4 class="fl">添加资源</h4>
                <div class="btn_wrap fr">
                    <el-button size="small" @click="addRes" :loading="loading" type="primary">添加资源</el-button>
                </div>
            </el-col>
        </el-form>
        <el-table max-height="350" :data="formData.newArr" align="left" border stripe style="width: 100%; margin: auto">
            <el-table-column label="操作" width="70" fixed="left">
                <template scope="scope">
                    <el-button :disabled="scope.row.isDel" @click="deleteRes(scope.$index)" type="text" size="samll" icon="delete2"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="breedName" label="品名" width="120">
            </el-table-column>
            <el-table-column label="规格" min-width="200">
                <template scope="scope" v-if="scope.row.specAttribute[scope.row.breedName]">
                    <span>{{scope.row.specAttribute[scope.row.breedName]['规格']}}</span>
                </template>
            </el-table-column>
            <el-table-column label="片型" width="140">
                <template scope="scope" v-if="scope.row.specAttribute[scope.row.breedName]">
                    <span>{{scope.row.specAttribute[scope.row.breedName]['片型']}}</span>
                </template>
            </el-table-column>
            <el-table-column label="产地" width="140">
                <template scope="scope">
                    <span>{{scope.row.locationName | filterLocation}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="number" label="数量" width="140">
                <template scope="scope">
                    <myInput :stockId="scope.row.stockId" :maxNum="scope.row.usableNum" v-model="scope.row.number"></myInput>
                </template>
            </el-table-column>
            <el-table-column label="资源可用量" width="140">
                <template scope="scope">
                    <usableNum :stockId="scope.row.stockId" :data="true" v-model="scope.row.usableNum"></usableNum>
                </template>
            </el-table-column>
            <el-table-column prop="unitId" label="单位" width="100">
                <template scope="scope">
                    <span>{{scope.row.unitId | filterUnit}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import myInput from '../../components/myInput.vue'
import usableNum from '../../components/usableNum.vue'
export default {
    name: 'editStockInfo',
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            loading: false,
            movNewAddResList: []
        }
    },
    components: {
        myInput,
        usableNum
    },
    computed: {
        formData() {
            let obj = this.$store.state.moveStorage.moveStorageInfo;
            //编辑时添加的数据
            let srcList = this.$store.state.moveStorage.movNewAddResList;
            let target = obj.stockMoveItems;
            obj.newArr = [];
            if (obj.stockMoveItems.length > 0) {
                obj.oldSiteName = obj.stockMoveItems[0].oldSiteName;
                obj.oldSiteId = obj.stockMoveItems[0].oldSiteId;
                obj.newSiteName = obj.stockMoveItems[0].newSiteName;
                obj.newSiteId = obj.stockMoveItems[0].newSiteId;
            } else {
                obj.oldSiteName = '';
                obj.oldSiteId = '';
                obj.newSiteName = '';
                obj.newSiteId = '';
            }
            //合并数组
            obj.newArr = target.concat(srcList);
            //处理日期时间  
            obj.moveDate = new Date(obj.moveDate);
            return obj;
        }
    },
    methods: {
        save(formName) {
            let _self = this;
            // 处理资源参数
            let arr = this.filterEditResList(_self.formData.newArr);
            // 处理请求传参
            let params = {
                no: _self.formData.no,
                id: _self.formData.id,
                batchNo: _self.formData.batchNo,
                customerId: _self.formData.customerId,
                depotId: _self.formData.depotId,
                moveDate: new Date(_self.formData.moveDate).getTime(),
                comment: _self.formData.comment,
                stockMoveItems: arr
            };
            console.log(arr);
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                    biz_module: 'wmsStockMoveService',
                    biz_method: 'updateStockMove',
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
            _self.$store.dispatch('mov_upDateMoveStorageInfo', obj).then(() => {
                this.$message({
                    type: 'success',
                    message: '操作成功'
                });
                _self.loading = false;
                let obj = {
                    dialog: false
                }
                this.$emit('showChangeEdit', obj);
            }, () => {
                _self.loading = false;
            });
        },
        addRes() {
            let _self = this;
            this.loading = true;
            this.getHttp().then(() => {
                _self.getSiteHttp().then(() => {
                    //改变显示状态
                    let obj = {
                        dialog: true,
                        showEdit: false,
                        showAdd: true,
                        title: '添加资源列表'
                    };
                    _self.$emit('showChangeEdit', obj);
                })
            })
        },
        deleteRes(index) {
            this.$confirm('确定删除该条资源吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('mov_NewDelResList', index).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        filterEditResList() {
            //原来的资源
            let oldRes = this.$store.state.moveStorage.moveStorageInfo.stockMoveItems;
            //新增的资源
            let newRes = this.$store.state.moveStorage.movNewAddResList;
            let newArr = []
            for (var i = 0; i < oldRes.length; i++) {
                let obj = {};
                obj.id = oldRes[i].id;
                obj.stockId = oldRes[i].stockId;
                obj.specAttribute = oldRes[i].specAttribute;
                obj.location = oldRes[i].location;
                obj.number = oldRes[i].number;
                obj.unitId = oldRes[i].unitId;
                obj.breedId = oldRes[i].breedId;
                obj.oldSiteId = this.formData.oldSiteId;
                obj.newSiteId = this.formData.newSiteId;
                newArr.push(obj);
            }
            for (var i = 0; i < newRes.length; i++) {
                let obj = {};
                obj.stockId = newRes[i].stockId;
                obj.specAttribute = newRes[i].specAttribute;
                obj.location = newRes[i].location;
                obj.number = newRes[i].number;
                obj.unitId = newRes[i].unitId;
                obj.breedId = newRes[i].breedId;
                obj.oldSiteId = this.formData.oldSiteId;
                obj.newSiteId = this.formData.newSiteId;
                newArr.push(obj);
            }
            return newArr;
        },
        //根据ID获取 当前货主下的资源列表
        getHttp() {
            let _self = this;
            return new Promise((resolve, reject) => {
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let sendParams = {
                    breedId: '',
                    depotType: '',
                    batchNo: '',
                    location: '',
                    depotId: _self.formData.depotId, //_self.formData.depotId
                    siteId: _self.formData.oldSiteId,
                    customerId: _self.formData.customerId,
                    societyDepotType: '社会库存',
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
                _self.$store.dispatch('mov_getMoveCustomerResList', obj).then(() => {
                    resolve();
                }, () => {
                    reject();
                });
            })
        },
        //根据仓库ID 获取当前仓库的库位点
        getSiteHttp() {
            let _self = this;
            return new Promise((resolve, reject) => {
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                        biz_module: 'wmsDepotService',
                        biz_method: 'queryDepotById',
                        biz_param: {
                            id: _self.formData.depotId
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
                _self.$store.dispatch('mov_getSiteList', obj).then(() => {
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
