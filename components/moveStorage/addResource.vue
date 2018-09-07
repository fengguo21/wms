<style lang="less" scoped>
.addResource {
    .btn_wrap {
        padding: 5px 10px;
        text-align: left;
    }
}
</style>
<template>
    <div class="addResource">
        <div class="form">
            <el-table align="center" max-height="600" :data="resourceList" border stripe style="width: 100%; margin: auto" v-loading="loading">
                <el-table-column label="操作" width="80" fixed="left">
                    <template scope="scope">
                        <el-button :disabled="scope.row.usableNum <= 0" icon="plus" @click="addResList(scope.$index)" type="text" size="small">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="siteName" label="原库位" width="120">
                </el-table-column>
                <el-table-column label="移库量" width="140">
                    <template scope="scope">
                        <myInput :stockId="scope.row.id" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                    </template>
                </el-table-column>
                <el-table-column label="资源可用量" width="140">
                    <template scope="scope">
                        <usableNum :stockId="scope.row.id" v-model="scope.row.usableNum"></usableNum>
                    </template>
                </el-table-column>
                <el-table-column prop="breedName" label="品名" width="100">
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
                <el-table-column prop="unitId" label="单位" width="80">
                    <template scope='scope'>
                        <span>{{scope.row.unitId | filterUnit }}</span>
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
            <el-button size="small" @click="backEdit" type="primary">返回新建</el-button>
        </div>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import myInput from '../../components/myInput.vue'
import usableNum from '../../components/usableNum.vue'
export default {
    name: 'addResource',
    props: ['byCustomer'],
    data() {
        return {
            loading: false,
            page: 1,
            pageSize: 10,
            unDisable: -1,
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
            return this.$store.state.search.siteList
        }
    },
    methods: {
        editResList(index) {
            this.unDisable = index;
        },
        addResList(index) {
            console.log('assdas');
            //避免重复添加资源
            let src = this.resourceList[index];
            for (var i = 0; i < this.sendList.length; i++) {
                let obj = this.sendList[i];
                if (src.id === obj.id) {
                    this.$message({
                        message: '不要重复添加资源',
                        type: 'info'
                    });
                    return;
                }
            }
            if (src.numNow <= 0) {
                this.$message({
                    message: '添加的资源数量不能少于0,请重新编辑',
                    type: 'info'
                });
                return;
            }
            this.sendList.push(src);
            this.$emit('addList', this.sendList);
            this.$message({
                message: '资源添加成功',
                type: 'success'
            });
        },
        backEdit() {
            let obj = {
                dialog: false,
            };
            //告诉父组件要从新获取编辑的数据
            this.$emit('addList', this.sendList);
            this.$emit('showChange', obj);
        },
        handleCurrentChange(val) {
            this.page = val;
            this.loading = true;
            this.getHttp();
        },
        //获取货主ID下的资源信息
        getHttp() {
            let _self = this;
            let src = this.resourceList[0];
            let depotId = '';
            let customerId = '';
            let siteId = '';
            if (src) {
                depotId = src.depotId;
                if (this.byCustomer) {
                    customerId = src.customerId;
                }
                siteId = src.siteId;
            } else {
                return;
            }
            return new Promise((resolve, reject) => {
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
