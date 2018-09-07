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
        <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" label-position="right">
            <div class="title clearfix">
                <h4 class="fl">仓库信息</h4>
                <div class="btn_wrap fr">
                    <el-button @click="save('formData')" type="primary" size="small" icon="check">保存</el-button>
                </div>
            </div>
            <el-col :span="12">
                <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="库存性质">
                    <el-select style="width: 100%" v-model="formData.type" placeholder="库存性质">
                        <el-option v-for="item in sel" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="地址" prop="PCD">
                    <el-cascader style="width: 100%" :options="options" v-model="formData.PCD">
                    </el-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="街道地址" prop="street">
                    <el-input v-model="formData.street" placeholder="请输入街道地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-show="false">
                <el-form-item label="详细地址">
                    <el-input v-model="formData.address"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="描述信息">
                    <el-input v-model="formData.description" placeholder="请输入描述信息"></el-input>
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
                <el-table align="center" max-height="400" :data="storeList" border stripe style="width: 902px; margin: auto" :v-loading.body="loading">
                    <el-table-column prop="name" label="库位名称" width="120">
                    </el-table-column>
                    <el-table-column prop="siteX" label="行" width="80">
                    </el-table-column>
                    <el-table-column prop="siteY" label="列" width="80">
                    </el-table-column>
                    <el-table-column prop="siteZ" label="层" width="80">
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
    getPCD
} from '../../filters/index.js';
import httpService from '../../common/httpService.js'
let selectAddress = addressLinkage();
let sel = [{
    value: 0,
    label: '实体库'
}, {
    value: 1,
    label: '虚拟库'
}]

export default {
    name: 'newStorage',
    data() {
        var validateAddress = (rule, value, callback) => {
            if (value.length == 0) {
                callback(new Error('请选择仓库地址'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            rules: {
                name: [{
                    required: true,
                    message: '请输入仓库名称',
                    trigger: 'blur'
                }],
                PCD: [{
                    required: true,
                    validator: validateAddress,
                    trigger: 'blur'
                }],
                street: [{
                    required: true,
                    message: '请填写街道地址',
                    trigger: 'blur'
                }],
                employee: [{
                    required: true,
                    message: '请输入主要联系人',
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    message: '联系人手机号码',
                    trigger: 'blur'
                }],
            },
            sel: sel,
            options: selectAddress,
            loading: false,
            formData: {
                type: 0,
                name: '',
                country: 7,
                province: -1,
                city: -1,
                district: -1,
                street: '',
                address: '',
                description: '',
                depotSites: [],
                PCD: [],
            },

        }

    },
    computed: {
        storeList() {
            return this.$store.state.warehouse.newSiteFormList.list;
        }

    },
    mounted() {
        this.formData = {
            type: 0,
            name: '',
            country: 7,
            province: -1,
            city: -1,
            district: -1,
            street: '',
            address: '',
            description: '',
            depotSites: [],
            PCD: [],
        }
    },
    methods: {
        save(formName) {
            let _self = this;
            _self.loading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 验证通过                   
                    _self.initPDC() //初始化省市县 为传参做准备
                        // 处理详细地址
                    let arr = _self.formData.PCD;
                    _self.formData.address = getPCD(arr[0], arr[1], arr[2]) + '/' + _self.formData.street;
                    let params = {
                        type: _self.formData.type,
                        name: _self.formData.name,
                        country: _self.formData.country,
                        province: _self.formData.province,
                        city: _self.formData.city,
                        district: _self.formData.district,
                        address: _self.formData.address,
                        description: _self.formData.description,
                        depotSites: _self.$store.state.warehouse.newSiteFormList.list,
                    }
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'wmsDepotService',
                        biz_method: 'addDepot',
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
                    _self.$store.dispatch('newAddStorage', obj).then(() => {
                        let obj = {};
                        obj.dialog = {
                            title: '',
                            dialog: false,
                            showNewStorage: false,
                            showAddSiteForm: false,
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
        //省市区参数初始化
        initPDC() {
            let ls = this.formData.PCD.length;
            let arr = this.formData.PCD;
            if (ls === 1) {
                // 只有特别行政区
                this.formData.province = arr[0];
                this.formData.city = -1;
                this.formData.district = -1;
            } else if (ls === 2) {
                this.formData.province = arr[0];
                this.formData.city = arr[1];
                this.formData.district = -1;
            } else if (ls === 3) {
                this.formData.province = arr[0];
                this.formData.city = arr[1];
                this.formData.district = arr[2];
            }
        },
        addSite() {
            // 显示库位框
            let obj = {};
            obj.dialog = {
                title: '新增库位地点',
                dialog: true,
                showNewStorage: false,
                showAddSiteForm: true
            }
            this.$emit('showChange', obj);
        },
        cascaderChange(item) {
            console.log(item);
        }
    }
}
</script>
