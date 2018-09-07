<style lang="less" scoped>
.editAddResource {
    .btn_wrap {
        padding: 5px 10px;
        text-align: left;
    }
}
</style>
<template>
    <div class="editAddResource">
        <div class="form">
            <el-table align="center" max-height="540" :data="resourceList" border stripe style="width: 100%; margin: auto">
                <el-table-column label="操作" width="80" fixed="left">
                    <template scope="scope">
                        <el-button icon="plus" :disabled="scope.row.usableNum <= 0" @click="addResList(scope.$index)" type="text" size="small">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="添加量" width="140">
                    <template scope="scope">
                        <myInput :stockId="scope.row.id" :disabled="scope.row.usableNum <= 0 && scope.row.numNow <= 0" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                    </template>
                </el-table-column>
                <el-table-column label="可用量" width="140">
                    <template scope="scope">
                        <usableNum :stockId="scope.row.id" v-model="scope.row.usableNum"></usableNum>
                    </template>
                </el-table-column>
                <el-table-column prop="unitId" label="单位" width="70">
                    <template scope='scope'>
                        <span>{{scope.row.unitId | filterUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="breedName" label="品名" width="100">
                </el-table-column>
                <el-table-column label="规格" width="240">
                    <template scope="scope">
                        <span v-if="scope.row.specAttribute[scope.row.breedName]">
                             {{scope.row.specAttribute[scope.row.breedName]['规格']}}
                         </span>
                    </template>
                </el-table-column>
                <el-table-column label="片型" width="100">
                    <template scope="scope">
                        <span v-if="scope.row.specAttribute[scope.row.breedName]">
                             {{scope.row.specAttribute[scope.row.breedName]['片型']}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="总数量" width="120">
                </el-table-column>
                <el-table-column label="产地">
                    <template scope="scope">
                        <span>{{scope.row.locationName | filterLocation}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <div class="btn_wrap">
            <el-button size="small" @click="backEdit" type="primary">返回编辑</el-button>
        </div>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import config from '../../common/common.config.json'
import myInput from '../../components/myInput.vue'
import usableNum from '../../components/usableNum.vue'
import {
    filterUnit
} from '../../filters/index.js'
let unitId = config.unit
export default {
    name: 'editAddResource',
    props: ['transferId'],
    data() {
        return {
            unDisable: -1,
            page: 1,
            pageSize: 10
        }
    },
    components: {
        myInput,
        usableNum
    },
    computed: {
        resourceList() {
            return this.$store.state.preTransfer.ptfCustomerResList.list;
        },
        total() {
            return this.$store.state.preTransfer.ptfCustomerResList.total;
        }
    },
    methods: {
        editResList(index) {
            this.unDisable = index;
        },
        addResList(index) {
            let _self = this;
            let src = this.resourceList[index];
            //新增字段剩余量
            src.stockId = src.id;
            let num = src.numNow;
            let oldRes = this.$store.state.preTransfer.preTransferInfo.list;
            for (var i = 0; i < oldRes.length; i++) {
                let obj = oldRes[i];
                if (obj.stockId == src.stockId) {
                    this.$message({
                        message: '请不要添加重复资源',
                        type: 'info'
                    });
                    return
                }
            };
            if (num <= 0) {
                this.$message({
                    type: 'info',
                    message: '添加资源数量不能少于0,请重新编辑'
                });
                return;
            }
            let unitStr = filterUnit(this.resourceList[index].unitId);
            this.$confirm('确定添加该条资源吗? 添加数量为:' + num + '  ' + unitStr, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    transferId: _self.transferId,
                    stockId: _self.resourceList[index].id,
                    num: Number(_self.resourceList[index].numNow),
                    comment: _self.resourceList[index].cmt
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsStockTransferService',
                    biz_method: 'addTransferItem',
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
                _self.$store.dispatch('ptf_addResItem', obj).then(() => {
                    //重新获取该货主下的资源列表数据
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        backEdit() {
            //重新获取一次资源列表数据
            this.getTransferInfoResList().then(() => {
                let obj = {
                    dialog: true,
                    title: '编辑预过户信息',
                    showEdit: true
                }
                this.$store.dispatch('ptf_changDialog', obj);
            })
        },
        //根据ID获取详情列表
        getTransferInfoResList() {
            let _self = this;
            return new Promise((resolve, reject) => {
                _self.loadingInfo = true;
                let params = {
                    transferId: _self.transferId
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
        changNum(index) {
            let obj = this.resourceList[index];
            if (obj.numNow > obj.usableNum) {
                obj.numNow = obj.usableNum;
                // 锁定输入框
                this.unDisable = -1;
            }
        },
        //获取指定用户ID 指定仓库下的资源
        getHttp(page) {
            let _self = this;
            let src = this.resourceList[0];
            console.log(src);
            let depotId = '';
            let customerId = '';
            if (src && src != undefined) {
                depotId = src.depotId;
                customerId = src.customerId;
            } else {
                depotId = -1;
                customerId = -1;
            }
            _self.loading = true;
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let sendParams = {
                breedId: '',
                depotType: '',
                batchNo: '',
                location: '',
                depotId: depotId, //_self.formData.depotId
                siteId: '',
                customerId: customerId,
                beginTime: '',
                endTime: '',
                page: _self.page,
                pageSize: _self.pageSize
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
            _self.$store.dispatch('ptf_getCustomerResList', obj).then(() => {
                _self.loading = false;
            }, () => {
                _self.loading = false;

            });
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getHttp();
        }

    }
}
</script>
