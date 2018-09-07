<style lang="less" scoped>
// 新建仓库
.newStorage {
    .title {
        padding: 10px 0;
        width: 100%;
        .fl {
            height: 26px;
            line-height: 26px;
        }
    }
}
</style>
<template>
    <div class="newStorage">
        <el-form :model="formData" ref="formData" label-width="80px" label-position="right">
            <div class="title clearfix">
                <h4 class="fl">仓库信息</h4>
                <div class="btn_wrap fr">
                    <el-button @click="save('formData')" type="primary" size="small" icon="check">保存</el-button>
                </div>
            </div>
            <el-col :span="12">
                <el-form-item label="仓库名称" prop="name">
                    <el-input disabled v-model="formData.name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="仓库类型">
                    <el-select disabled style="width: 100%" v-model="formData.type" placeholder="仓库类型">
                        <el-option v-for="item in sel" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="管理员" prop="name">
                    <el-input v-model="formData.employee"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="详细地址" prop="address">
                    <el-input disabled v-model="formData.address"></el-input>
                </el-form-item>
            </el-col>
            <div class="title clearfix">
                <h4 class="fl">库位信息</h4>
                <div class="btn_wrap fr">
                    <el-button @click="addSite" size="small" type="primary" icon="plus">添加库位点</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <div class="table">
                <el-table align="center" max-height="400" :data="formData.depotSites" border stripe style="width: 902px; margin: auto" :v-loading.body="loading">
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-button @click="del(scope.row.id)" type="text" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="库位编号" width="120">
                    </el-table-column>
                    <el-table-column prop="name" label="库位名称" width="120">
                    </el-table-column>
                    <el-table-column prop="siteX" label="行" width="100">
                    </el-table-column>
                    <el-table-column prop="siteY" label="列" width="100">
                    </el-table-column>
                    <el-table-column prop="siteZ" label="层" width="100">
                    </el-table-column>
                    <el-table-column prop="description" label="备注" min-width="220">
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
    </div>
</template>
<script>
import {
    addressLinkage,
    getPDC
} from '../../filters/index.js';
import httpService from '../../common/httpService.js'
let selectAddress = addressLinkage();
let sel = [{
    value: 0,
    label: '自有'
}, {
    value: 1,
    label: '三方'
}]

export default {
    name: 'newStorage',
    props: ['paramsId'],
    data() {
        return {
            loading: false,
            sel: sel,
            options: selectAddress,
            loading: false,
            dialogVisible: {
                dialog: false,
                title: ''
            },
        }

    },
    computed: {
        storeList() {
            return this.$store.state.warehouse.editSiteFormList.list;
        },
        formData() {
            return this.$store.state.warehouse.stroeInfo;
        }

    },
    methods: {
        save(formName) {
            let _self = this;
            _self.loading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理库位列表
                    _self.formData.depotSites = _self.$store.state.warehouse.editSiteFormList.list;
                    let params = {
                        type: _self.formData.type,
                        country: _self.formData.country,
                        province: _self.formData.province,
                        city: _self.formData.city,
                        district: _self.formData.district,
                        address: _self.formData.address,
                        description: _self.formData.description,
                        depotSites: _self.formData.depotSites,
                        id: _self.formData.id,
                        employee: _self.formData.employee,
                    }

                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'wmsDepotService',
                        biz_method: 'updateDepot',
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
                    _self.$store.dispatch('newAddStorage', obj).then(() => {
                        let obj = {};
                        obj.dialog = {
                            title: '',
                            dialog: false,
                            showNewStorage: false,
                            showAddSiteForm: false
                        };
                        // 告诉父组件重新获取数据
                        obj.isGetData = true;
                        _self.$emit('showChange', obj);
                        _self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        _self.loading = false;
                    }, () => {
                        _self.loading = false;
                    });

                } else {
                    return false;
                }
            });

        },
        // 删除库位
        del(paramsId) {
            // 隐藏编辑仓库对话框          
            let _self = this;
            this.$confirm('确定删除该库位？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 执行删除
                let params = {
                    id: paramsId,
                    depotId: _self.$store.state.warehouse.depotId
                }
                let url = httpService.urlCommon + httpService.apiUrl.most;
                let body = {
                    biz_module: 'wmsDepotService',
                    biz_method: 'deleteDepotSite',
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
                _self.$store.dispatch('deleteDepotSite', obj).then(() => {
                    _self.getStoreInfo();
                }, () => {
                    _self.loading = false;
                });

            }).catch(() => {
                // 显示
                _self.showStroe();
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });


            });

        },
        hideStore() {
            let obj = {};
            obj.dialog = {
                dialog: false,
                showEditStroe: false,
                showEditSiteForm: false,
                title: ''
            }
            this.$emit('showChange', obj);
        },
        showStroe() {
            let obj = {};
            obj.dialog = {
                dialog: true,
                showEditStroe: true,
                showEditSiteForm: false,
                title: '编辑仓库'
            }
            this.$emit('showChange', obj);
        },
        addSite() {
            // 显示库位框
            let obj = {};
            obj.dialog = {
                title: '新增库位地点',
                dialog: true,
                showEditStroe: false,
                showEditSiteForm: true
            }
            this.$emit('showChange', obj);
        },
        getStoreInfo(paramsId) {
            this.loading = true;
            let _self = this;
            let param = {
                id: _self.$store.state.warehouse.depotId
            }
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'wmsDepotService',
                biz_method: 'queryDepotById',
                biz_param: param
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
                let obj = {};
                obj.dialog = {
                    dialog: true,
                    showEditStroe: true,
                    showEditSiteForm: false,
                    title: '编辑仓库'
                }
                _self.$emit('showChange', obj);
                _self.$message({
                    message: '删除成功',
                    type: 'success'
                });
                _self.loading = false;
            }, () => {
                _self.loading = false;
            });
        },
    }
}
</script>