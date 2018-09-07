<style lang="less" scoped>
.addEnterprise {
    .title {
        padding: 10px 0;
        width: 100%;
        .fl {
            height: 36px;
            line-height: 36px;
        }
    }
    .form {
        margin-bottom: 50px;
    }
}
</style>
<template>
    <div class="addEnterprise">
        <el-form class="clearfix form" ref="formData" :rules="rules" :model="formData" label-width="90px" label-position="center">
            <div class="title clearfix">
                <h4 class="fl">企业信息</h4>
                <div class="btn_wrap fr">
                    <el-button v-on:click="save('formData')" size="small" type="primary" icon="check">保存</el-button>
                </div>
            </div>
            <el-col :span="8">
                <el-form-item label="货主名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入货主名称"></el-input>
                </el-form-item>
            </el-col>
            <!--<el-col :span="8">
                <el-form-item label="货主简称" prop="shortName">
                    <el-input v-model="formData.shortName" placeholder="请输入货主简称"></el-input>
                </el-form-item>
            </el-col>-->
            <el-col :span="8">
                <el-form-item label="货主类型">
                    <el-select style="width: 100%" v-model="formData.type" placeholder="货主类型">
                        <el-option v-for="item in sel" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系人" prop="mainContact">
                    <el-input v-model="formData.mainContact" placeholder="请输入联系人"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="手机号码" prop="mainPhone">
                    <el-input v-model="formData.mainPhone" placeholder="请输入联系人手机"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="座机号码">
                    <el-input v-model="formData.tel" placeholder="请输入联系人座机"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="省/市" prop="PCD">
                    <el-cascader style="width: 100%" :options="options" v-model="formData.PCD">
                    </el-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="街道地址" prop="street">
                    <el-input v-model="formData.street" placeholder="请输入街道地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="16" v-show="false">
                <el-form-item label="详细地址">
                    <el-input v-model="formData.address"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="选择文件">
                    <imageUpload :param="param" :imageArray="formData.imageArray" v-on:postUrl="getImgUrl"></imageUpload>
                </el-form-item>
            </el-col>
        </el-form>
    </div>
</template>
<script>
import {
    addressLinkage,
    getPCD
} from '../../filters/index.js';
import httpService from '../../common/httpService.js'
import imageUpload from '../../components/imageUpload.vue'
let selectAddress = addressLinkage();
let sel = [{value: 0,label: '其他'}, 
			{value: 1,label: '合作社'},
			{value: 2,label: '药商'}, 
			{value: 3,label: '药厂'},
			{value: 4,label: '个体户'}, 
			{value: 5,label: '药店'},
			{value: 6,label: '医院'}, 
			{value: 7,label: '贸易公司'},
			{value: 8,label: '零售商行'}, 
			{value: 9,label: '药农'},
			
			{value: 10,label: '介绍人'}, 
			{value: 11,label: '药贩子'},
			{value: 12,label: '产地药商'},
			{value: 13,label: '销地药商'}, 
			{value: 14,label: '药农'},
			{value: 15,label: '药农'}, 
			{value: 16,label: '诊所'},
			{value: 17,label: '化工厂'},
			{value: 18,label: '化妆品厂'}, 
			{value: 19,label: '提取物厂'},
			
			{value: 20,label: '食品厂'}, 
			{value: 21,label: '实验室'},
			{value: 22,label: '网上电商'},
			{value: 23,label: '中成药生产商'}, 
			{value: 24,label: '西药生产商'},
			{value: 25,label: '饮片厂'}, 
			{value: 26,label: '花茶厂'},
			{value: 27,label: '种植基地'},
]		
export default {
    name: 'addEnterprise',
    props: {
        formData: {
            default: null
        }
    },
    components: {
        imageUpload
    },
    data() {
        var validateAddress = (rule, value, callback) => {
            if (value.length == 0) {
                callback(new Error('请选择省/市/县地址'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            sel: sel,
            options: selectAddress,
            rules: {
                name: [{
                    required: true,
                    message: '请输货主名称',
                    trigger: 'blur, change'
                }],
                shortName: [{
                    required: true,
                    message: '请输货主简称',
                    trigger: 'blur, change'
                }],
                PCD: [{
                    required: true,
                    validator: validateAddress,
                    trigger: 'blur, change'
                }],
                street: [{
                    required: true,
                    message: '请填写街道地址',
                    trigger: 'blur, change'
                }],
                mainContact: [{
                    required: true,
                    message: '请输入主要联系人',
                    trigger: 'blur, change'
                }],
                mainPhone: [{
                    required: true,
                    pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
                    message: '请输入合法的手机号',
                    trigger: 'blur, change'
                }],
            },           
            param: {
                keyName: 'wms'
            },
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
                        // 处理库位列表
                        // 处理详细地址
                    let arr = _self.formData.PCD;
                    _self.formData.address = getPCD(arr[0], arr[1], arr[2]) + '/' + _self.formData.street;
                    let params = {
                        type: _self.formData.type,
                        name: _self.formData.name,
                        shortName: _self.formData.shortName,
                        mainContact: _self.formData.mainContact,
                        mainPhone: _self.formData.mainPhone,
                        tel: _self.formData.contactTel,
                        country: _self.formData.country,
                        province: _self.formData.province,
                        city: _self.formData.city,
                        district: _self.formData.district,
                        address: _self.formData.address,
                        imageArray: _self.formData.imageArray
                    };
                    
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let method = '';
                    if (_self.formData.id) {
                        method = 'updateCustomer';
                        params.id = _self.formData.id;
                    } else {
                        method = 'addCustomer';
                    }
                    let body = {
                        biz_module: 'wmsCustomerService',
                        biz_method: method,
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
                    _self.$store.dispatch('addCustomer', obj).then(() => {
                        let obj = {};
                        obj.dialog = {
                            title: '',
                            dialog: false
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
                this.formData.province = Number(arr[0]);
                this.formData.city = -1;
                this.formData.district = -1;
            } else if (ls === 2) {
                this.formData.province = Number(arr[0]);
                this.formData.city = Number(arr[1]);
                this.formData.district = -1;
            } else if (ls === 3) {
                this.formData.province = Number(arr[0]);
                this.formData.city = Number(arr[1]);
                this.formData.district = Number(arr[2]);
            }
        },
        getImgUrl(params) {
            this.formData.imageArray.push(params);
        }
    }
    
}
</script>
