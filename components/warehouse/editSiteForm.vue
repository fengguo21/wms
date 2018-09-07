<style lang="less" scoped>
</style>
<template>
    <div class="addResource">
        <div class="form">
            <el-form ref="formData" :rules="rules" :model="formData" class="demo-form-inline" label-width="80px" label-position="right">
                <el-form-item label="库位名称" prop="name">
                    <el-input placeholder="库位名称" v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="库位行" prop="siteX">
                    <el-input placeholder="库位行" v-model="formData.siteX"></el-input>
                </el-form-item>
                <el-form-item label="库位列" prop="siteY">
                    <el-input placeholder="库位列" v-model="formData.siteY"></el-input>
                </el-form-item>
                <el-form-item label="库位层" prop="siteZ">
                    <el-input placeholder="库位层" v-model="formData.siteZ"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input placeholder="备注" v-model="formData.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="add('formData')" type="primary" icon="check">确认添加</el-button>
                    <el-button @click="close('formData')" icon="close">取消添加</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
export default {
    name: 'addSiteForm',
    data() {
        return {
            rules: {
                name: [{
                    required: true,
                    message: '请填写仓库名称',
                    trigger: 'blur'
                }],
                siteX: [{
                    required: true,
                    message: '请填写仓库行',
                    trigger: 'blur'
                }],
                siteY: [{
                    required: true,
                    message: '请填写仓库列',
                    trigger: 'blur'
                }],
                siteZ: [{
                    required: true,
                    message: '请填写仓库层',
                    trigger: 'blur'
                }],
            },
            formData: {
                name: '',
                siteX: '',
                siteY: '',
                siteZ: '',
                description: ''
            }
        }
    },
    methods: {
        add(formName) {
            // 验证表单 
            let _self = this;
            _self.loading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 处理库位列表
                    let depotId = _self.$store.state.warehouse.depotId;
                    let params = {
                        depotId: depotId,
                        name: _self.formData.name,
                        siteX: _self.formData.siteX,
                        siteY: _self.formData.siteY,
                        siteZ: _self.formData.siteZ,
                        district: _self.formData.district,
                        description: _self.formData.description,
                    }

                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                            biz_module: 'wmsDepotService',
                            biz_method: 'addDepotSite',
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
                    _self.$store.dispatch('addSite', obj).then(() => {
                        // 编辑页面从新获取数据
                        _self.getStoreInfo();
                    }, () => {
                        _self.loading = false;
                    });

                } else {
                    return false;
                }
            });
            // let _self = this;
            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
            //         // 验证通过
            //         let _self = this;
            //         _self.$store.dispatch('addEditSiteFormList', _self.formData).then(() => {
            //             //改变表单的显隐 并清空表单
            //             let obj = {};
            //             obj.dialog = {
            //                 title: '',
            //                 dialog: true,
            //                 showEditStroe: true,
            //                 showEditSiteForm: false
            //             }
            //             this.$emit('showChange', obj);
            //             this.$message({
            //                 message: '列表添加成功',
            //                 type: 'success'
            //             });
            //         });

            //     } else {
            //         return false;
            //     }
            // });
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
                    message: '列表添加成功',
                    type: 'success'
                });
                _self.loading = false;
            }, () => {
                _self.loading = false;
            });
        },
        close() {
            let obj = {}
            obj.dialog = {
                title: '编辑仓库',
                dialog: true,
                showEditStroe: true,
                showEditSiteForm: false
            }
            this.$emit('showChange', obj);
            this.$message({
                message: '已取消',
                type: 'info'
            });
        }
    }
}
</script>
