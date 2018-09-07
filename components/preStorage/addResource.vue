<style lang="less" scoped>
.addResource {}
</style>
<template>
    <div class="addResource">
        <div class="form">
            <el-form ref="formData" label-width="110px" :rules="rules" :model="formData" class="demo-form-inline" label-position="right">
                <el-col :span="24">
                    <el-form-item label="品名" prop="breedId">
                        <breed style="width: 100%" v-model="formData.breedName" v-on:getBreedId="getBreedId"></breed>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="规格" prop="gg">
                        <el-input v-model="formData.gg" placeholder="请输入规格"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="片型" prop="px">
                        <el-input v-model="formData.px" placeholder="请输入片型"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产地" prop="location">
                        <el-select :disabled="!formData.breedId" v-model="formData.location" filterable remote placeholder="请选择产地">
                            <el-option v-for="item in locationList" :key="item.id" :label="item.name" :value="item.locationId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="数量" prop="num">
                        <el-input v-model.number="formData.num" placeholder="请输入数量"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单位" prop="unitId">
                        <el-select style="width:100%" v-model="formData.unitId" placeholder="请选择单位">
                            <el-option v-for="item in units" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="库位点" prop="siteId">
                        <site v-on:getSite="getSite"></site>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注信息">
                        <el-input v-model="formData.comment" placeholder="请填写备注信息"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="上传图片">
                        <imageUpload :param="param" :imageArray='formData.imageArray' v-on:postUrl="getImgUrl"></imageUpload>
                    </el-form-item>
                </el-col>
                <el-col :span="24" style="margin-bottom: 20px;">
                    <el-button size="small" @click="add('formData')" type="primary" icon="check">确认添加</el-button>
                    <el-button size="small" @click="close" type="primary" icon="close">取消添加</el-button>
                </el-col>
            </el-form>
        </div>
    </div>
</template>
<script>
import breed from '../../components/search/breed.vue'
import httpService from '../../common/httpService.js'
import site from '../../components/search/site.vue'
import config from '../../common/common.config.json'
import imageUpload from '../imageUpload.vue'
let units = config.unit;
export default {
    name: 'new_storageIn_addResource',
    props: {
        type: {
            default: null,
        },
        formData: {
            default: null,
        }
    },
    data() {
        return {
            locationList: [],
            units: units,
            rules: {
                breedId: [{
                    required: true,
                    type: 'number',
                    message: '请输入药品名称',
                    trigger: 'blur,change'
                }],
                num: [{
                    required: true,
                    pattern: /^\d+(\.\d{0,2})?$/,
                    message: '资源数量为空,或格式错误',
                    trigger: 'change,blur'
                }],
                unitId: [{
                    required: true,
                    type: 'number',
                    message: '请选择药品单位',
                    trigger: 'change,blur'
                }],
                location: [{
                    required: true,
                    type: 'number',
                    message: '请输入药品产地',
                    trigger: 'change,blur'
                }],
                siteId: [{
                    required: true,
                    type: 'number',
                    message: '请选库位点',
                    trigger: 'change,blur'
                }],
                gg: [{
                    required: true,
                    message: '规格不能为空',
                    trigger: 'change,blur'
                }],
                px: [{
                    required: true,
                    message: '片型不能为空',
                    trigger: 'change,blur'
                }],
            },
            param: {
                keyName: 'yaocai'
            }
        }
    },
    computed: {
        siteList() {
            return this.$store.state.search.siteList.length == 0 ? true : false;
        }
    },
    components: {
        breed,
        site,
        imageUpload
    },
    methods: {
        add(formName) {
            let _self = this;
            if (Number(this.formData.num) <= 0) {
                this.$message({
                    message: '新添加的资源数量不能少于0,请重新编辑',
                    type: 'info'
                });
                return;
            };
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 包装规格
                    let breedName = this.formData.breedName;
                    let gg = '规格';
                    let px = '片型';
                    this.formData.specAttribute[breedName] = {
                        '规格': this.formData.gg,
                        '片型': this.formData.px
                    };
                    //新添加
                    if (this.type === 'new') {
                        //添加列表成功 交互显示
                        //处理列表 地址显示问题
                        for (var i = 0; i < this.locationList.length; i++) {
                            let obj = this.locationList[i];
                            if (this.formData.location === obj.locationId) {
                                this.formData.locationName = obj.name;
                                break;
                            }
                        }
                        this.$emit('addList', _self.formData);
                    } else if (this.type === 'preEdit') { //预入库编辑
                        _self.$store.dispatch('pre_InStorNewAddResList', _self.formData).then(() => {
                            let obj = {
                                dialog: true,
                                showEdit: true,
                                title: '编辑预入库信息',
                            }
                            this.$store.dispatch('com_changeShowDialog', obj);
                            this.$message({
                                message: '列表添加成功',
                                type: 'success'
                            });
                        });
                    } else if (this.type === 'inEdit') { //正式入库编辑
                        _self.$store.dispatch('put_InStorNewAddResList', _self.formData).then(() => {
                            let obj = {
                                dialog: true,
                                showEdit: true,
                                title: '编辑预库信息',
                            }
                            this.$store.dispatch('com_changeShowDialog', obj);
                            this.$message({
                                message: '列表添加成功',
                                type: 'success'
                            });
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        close() {
            //根据不同类型 切换不同显示
            if (this.type === 'new') {
                this.$emit('addList');
            } else if (this.type === 'preEdit') {
                let obj = {
                    dialog: true,
                    showEdit: true,
                    title: '编辑预入库信息',
                }
                this.$store.dispatch('com_changeShowDialog', obj);
            } else if (this.type === 'inEdit') {
                let obj = {
                    dialog: true,
                    showEdit: true,
                    title: '编辑预库信息',
                }
                this.$store.dispatch('com_changeShowDialog', obj);
            }
        },
        getBreedId(params) {
            this.formData.breedId = params.breedId;
            this.formData.breedName = params.breedName;
            this.locationList = [{
                name: '不限',
                id: -1
            }];
            this.getLocationList();
        },
        getSite(params) {
            this.formData.siteId = params.id;
            this.formData.siteName = params.name;
        },
        getImgUrl(params) {
            this.formData.imageArray.push(params);
        },
        //获取药材产地
        getLocationList() {
            let _self = this;
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'breedService',
                biz_method: 'queryLocalSpecList',
                biz_param: {
                    breedId: _self.formData.breedId,
                    name: _self.formData.breedName
                }
            };
            //加密处理接口          
            let obj = {
                body: body,
                path: url
            }
            _self.loading = true;
            _self.$store.dispatch('getLocationListById', obj).then((res) => {
                _self.locationList = res.biz_result.localList;
                _self.loading = false;
            }, () => {
                _self.loading = false;
            });
        }
    }
}
</script>
