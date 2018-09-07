<style lang="less" scoped>
// 仓库管理
.warehouse {
    width: 100%;
    .table {
        width: 100%;
    }
    .pages {
        padding: 20px;
        text-align: center;
    }
}
</style>
<template>
    <div class="warehouse">
        <searchHeader v-on:search="search"></searchHeader>
        <!-- 表格 -->
        <div class="table">
            <el-table :data="storeList" border stripe :v-loading.body="loading">
                <el-table-column label="操作" width="120">
                    <template scope="scope">
                        <el-button @click="edit(scope.row.id)" type="text" size="mini">编辑</el-button>
                        <el-button @click="del(scope.row.id)" type="text" size="mini">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="ctime" label="创建时间" width="240">
                    <template scope="scope">
                        <span>{{ scope.row.ctime | userBirthday}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="仓库名称" width="280">
                </el-table-column>
                <el-table-column prop="type" label="库存性质" width="120">
                    <template scope="scope">
                        <span v-if="scope.row.type===0">实体库</span>
                        <span v-if="scope.row.type===1">虚拟库</span>
                    </template>
                </el-table-column>
                <el-table-column prop="employeeName" label="仓库管理员" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址" min-width="500">
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pages">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParams.page" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- 编辑模态框 -->
        <el-dialog style="text-align:center" :title="dialogVisible.title" v-model="dialogVisible.dialog">
            <editStroe :paramsId="paramsId" v-on:showChange="showChange" v-if="dialogVisible.showEditStroe"></editStroe>
            <editSiteForm v-on:showChange="showChange" v-if="dialogVisible.showEditSiteForm"></editSiteForm>
        </el-dialog>
    </div>
</template>
<script>
import searchHeader from '../../../components/warehouse/searchHeader.vue'
import httpService from '../../../common/httpService.js'
import editStroe from '../../../components/warehouse/editStroe.vue'
import editSiteForm from '../../../components/warehouse/editSiteForm.vue'
let httpParams = {
    page: 1,
    pageSize: 10,
    type: '',
    name: '',
    address: ''
};

function getHttp(store, req) {
    let url = httpService.urlCommon + httpService.apiUrl.most;
    let body = {
        biz_module: 'wmsDepotService',
        biz_method: 'queryDepot',
        biz_param: httpParams
    };
    if (!httpService.SID) {
        httpService.getSID(req);
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
    return store.dispatch('getWarehouseList', obj);
};
export default {
    name: 'warehouse-view',
    data() {
        return {
            loading: false,
            httpParams: httpParams,
            value2: null,
            pickerOptions1: '',
            dialogVisible: {
                dialog: false,
                title: '',
                showEditStroe: false,
                showEditSiteForm: false
            },
            paramsId: 0
        }
    },
    components: {
        searchHeader,
        editStroe,
        editSiteForm
    },
    mounted() {
        this.getHttp();
    },
    computed: {
        storeList() {
            return this.$store.state.warehouse.warehouseList.list;
        },
        total() {
            return this.$store.state.warehouse.total;
        },

    },
    methods: {
        search(params) {
            this.httpParams = params;
            this.getHttp();
        },
        getHttp() {
            this.loading = true;
            let _self = this;
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'wmsDepotService',
                biz_method: 'queryDepot',
                biz_param: _self.httpParams
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
            _self.$store.dispatch('getWarehouseList', obj).then(() => {
                _self.loading = false;
            }, () => {
                _self.loading = false;
            });

        },
        // 编辑仓库信息
        edit(paramsId) {
            this.loading = true;
            let _self = this;
            let params = {
                id: paramsId
            }
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'wmsDepotService',
                biz_method: 'queryDepotById',
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
            _self.$store.dispatch('getStoreInfo', obj).then(() => {
                _self.loading = false;
                _self.dialogVisible.dialog = true;
                _self.dialogVisible.showEditStroe = true;
                _self.dialogVisible.showEditSiteForm = false;
                _self.dialogVisible.title = '编辑仓库';
            }, () => {
                _self.loading = false;
            });

        },
        // 删除
        del(paramsId) {
            let _self = this;
            this.$confirm('确定删除该条仓库信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 执行删除
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsDepotService',
                    biz_method: 'deleteDepot',
                    biz_param: {
                        id: paramsId
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
                _self.$store.dispatch('deleteStorage', obj).then(() => {
                    _self.httpParams.page = 1;
                    _self.getHttp();
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    _self.loading = false;
                }, () => {
                    _self.loading = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        showChange(params) {
            this.dialogVisible = params.dialog;
            //这里可以处理一些事情
            this.getHttp();
        },
        handleCurrentChange(val) {
            httpParams.page = val;
            this.httpParams.page = val;
            this.getHttp();
        }
    }
}
</script>