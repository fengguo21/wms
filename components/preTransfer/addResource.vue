<style lang="less" scoped>
.addResource {
    .pages {}
    .btn_wrap {
        padding: 5px 15px;
        text-align: left;
    }
}
</style>
<template>
    <div class="addResource">
        <div class="form">
            <el-table align="center" max-height="460" :data="resourceList" border stripe style="width: 100%; margin: auto" v-loading="loading">
                <el-table-column label="操作" width="80" fixed="left">
                    <template scope="scope">
                        <el-button :disabled="scope.row.usableNum <= 0" @click="addResList(scope.$index)" type="text" size="small" icon="plus">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="numNow" label="过户数量" width="140">
                    <template scope="scope">
                        <myInput :stockId="scope.row.id" :maxNum="scope.row.usableNum" v-model="scope.row.numNow"></myInput>
                    </template>
                </el-table-column>
                <el-table-column prop="usableNum" label="可用数量" width="120">
                    <template scope="scope">
                        <usableNum :stockId="scope.row.id" v-model="scope.row.usableNum"></usableNum>
                    </template>
                </el-table-column>
                <el-table-column prop="unitId" label="单位" width="80">
                    <template scope='scope'>
                        <span>{{scope.row.unitId | filterUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="breedName" label="品名" width="160">
                </el-table-column>
                <el-table-column label="规格" width="240">
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
            <el-button @click="back" size="small" type="primary">返回新建</el-button>
        </div>
    </div>
</template>
<script>
import breed from '../../components/search/breed.vue'
import httpService from '../../common/httpService.js'
import site from '../../components/search/site.vue'
import myInput from '../../components/myInput.vue'
import usableNum from '../../components/usableNum.vue'
export default {
    name: 'addResource',
    data() {
        return {
            loading: false,
            page: 1,
            pageSize: 10,
            unDisabled: -1
        }
    },
    computed: {
        resourceList() {
            return this.$store.state.preTransfer.ptfCustomerResList.list;
        },
        total() {
            return this.$store.state.preTransfer.ptfCustomerResList.total;
        }
    },
    components: {
        breed,
        site,
        myInput,
        usableNum
    },
    methods: {
        back() {
            this.$emit('showChange');
        },
        addResList(index) {
            //排除重复资源
            let src = this.resourceList[index];
            let tar = this.$store.state.preTransfer.ptfNewFormResList;
            for (var i = 0; i < tar.length; i++) {
                let obj = tar[i];
                if (src.id == obj.id) {
                    this.$message({
                        message: '请不要添加重复资源',
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
            this.$store.dispatch('ptf_newFormAddList', src).then(() => {
                this.$message({
                    message: '资源添加成功',
                    type: 'success'
                });
            })
        },
        editResList(index) {
            this.unDisabled = index;
            //改变当前表格的出库量为0
            this.resourceList[index].numNow = 0;
        },
        getBreedId(params) {
            this.formData.breedId = params.breedId;
            this.formData.breedName = params.breedName;
        },
        getSite(params) {
            this.formData.siteId = params.id;
            this.formData.siteName = params.name;
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getHttp();
        },
        //获取指定用户ID 指定仓库下的资源
        getHttp() {
            let _self = this;
            let src = this.resourceList[0];
            let depotId = '';
            let customerId = '';
            if (src && src != undefined) {
                depotId = src.depotId;
                customerId = src.customerId;
            } else {
                //清空资源列表
                // this.$store.dispatch('out_newClearResList');
                return;
            }
            if (!!depotId && !!customerId) {
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
            } else {
                //清空资源列表
                // this.$store.dispatch('out_newClearResList');
            }
        },
        changNum(index) {
            let obj = this.resourceList[index];
            if (obj.numNow > obj.usableNum) {
                obj.numNow = obj.usableNum;
                // 锁定输入框
                this.unDisabled = -1;
            }
        }
    }
}
</script>
