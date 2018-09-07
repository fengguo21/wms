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
            <el-table align="center" max-height="600" :data="resourceList" border stripe style="width:100%; margin: auto">
                <el-table-column label="操作" width="70" fixed="left">
                    <template scope="scope">
                        <el-button :disabled="scope.row.usableNum <= 0" @click="addResList(scope.$index)" icon="plus" type="text" size="small">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="siteName" label="原库位" width="120">
                </el-table-column>
                <el-table-column label="移库数量" width="140">
                    <template scope="scope">
                        <myInput :stockId="scope.row.id" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                    </template>
                </el-table-column>
                <el-table-column label="资源可用量" width="140">
                    <template scope="scope">
                        <usableNum :stockId="scope.row.id" v-model="scope.row.usableNum"></usableNum>
                    </template>
                </el-table-column>
                <el-table-column prop="unitId" label="单位" width="80">
                    <template scope='scope'>
                        <span>{{scope.row.unitId | filterUnit }}</span>
                    </template>
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
                <el-table-column label="片型" width="120">
                    <template scope="scope">
                        <span v-if="scope.row.specAttribute[scope.row.breedName]">
                            {{scope.row.specAttribute[scope.row.breedName]['片型']}}
                        </span>
                    </template>
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
import myInput from '../../components/myInput.vue'
import usableNum from '../../components/usableNum.vue'
export default {
    name: 'addResource',
    data() {
        return {
            page: 1,
            pageSize: 10,
            sendList: []
        }
    },
    components: {
        myInput,
        usableNum
    },
    computed: {
        resourceList() {
            return this.$store.state.moveStorage.moveCustomerResList.list;
        },
        total() {
            return this.$store.state.moveStorage.moveCustomerResList.total;
        },
        sites() {
            return this.$store.state.moveStorage.movSiteList;
        }
    },
    methods: {
        editResList(index) {
            this.unDisable = index;
        },
        addResList(index) {
            //避免重复添加资源
            let src = this.resourceList[index];
            src.stockId = src.id;
            src.number = src.numNow;
            let oldRes = this.$store.state.moveStorage.moveStorageInfo.stockMoveItems;
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
            let tag = this.$store.state.moveStorage.movNewAddResList;
            for (var i = 0; i < tag.length; i++) {
                let obj = tag[i];
                if (src.id === obj.id) {
                    this.$message({
                        message: '不要重复添加资源',
                        type: 'info'
                    });
                    return;
                }
            };
            if (src.number <= 0) {
                this.$message({
                    message: '资源添加数量不能少于0,请重新编辑',
                    type: 'info'
                });
                return;
            };
            //数据存到vuex中
            this.$store.dispatch('mov_NewAddResList', src);
            this.$message({
                message: '资源添加成功',
                type: 'success'
            });
        },
        backEdit() {
            let obj = {
                dialog: true,
                showEdit: true,
                showAdd: false,
                title: '编辑移库单信息'
            };
            //告诉父组件要从新获取编辑的数据
            this.$emit('addList', this.sendList);
            this.$emit('showChangeEdit', obj);
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getHttp();
        },
        getHttp() {
            let _self = this;
            return new Promise((resolve, reject) => {
                let depotId = _self.resourceList[0].depotId;
                let customerId = _self.resourceList[0].customerId;
                let siteId = _self.resourceList[0].siteId;
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let sendParams = {
                    breedId: '',
                    depotType: '',
                    batchNo: '',
                    location: '',
                    depotId: depotId, //_self.formData.depotId
                    siteId: siteId,
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
                _self.$store.dispatch('mov_getMoveCustomerResList', obj).then(() => {
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
