<!-- 编辑预过户表单 -->
<style lang="less" scoped>
.sendGoods {
    .title {
        padding: 10px 0;
        width: 100%;
        .fl {
            height: 36px;
            line-height: 36px;
        }
    }
}
</style>
<template>
    <div class="sendGoods">
        <el-form ref="formData" :model="formData" label-width="110px" label-position="center">
            <div class="title clearfix">
                <h4 class="fl">收货人信息</h4>
            </div>
            <div class="clearfix">
                <el-col :span="8">
                    <el-form-item label="收货人">
                        <el-input disabled v-model="formData.consigneeName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input disabled v-model="formData.consigneePhone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收货地址">
                        <el-input disabled v-model="formData.address"></el-input>
                    </el-form-item>
                </el-col>
            </div>
        </el-form>
        <el-form ref="logistics" :model="logistics" :rules="rules" label-width="110px" label-position="center">
            <div class="title clearfix">
                <h4 class="fl">物流信息</h4>
            </div>
            <div class="clearfix">
                <el-col :span="8">
                    <el-form-item label="发货方式">
                        <el-select style="width: 100%;" v-model="logistics.way" placeholder="请选择">
                            <el-option label="第三方物流" :value="0">
                            </el-option>
                            <el-option label="包车自运" :value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发货时间" prop="deliveryTime">
                        <el-date-picker :picker-options="pickerOptions" style="width: 100%" :clearable="false" v-model="logistics.deliveryTime" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="运费支付方式">
                        <el-select style="width: 100%;" v-model="logistics.freightType" placeholder="请选择">
                            <el-option label="我方支付" :value="0">
                            </el-option>
                            <el-option label="客户支付" :value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="运费金额" prop="freight">
                        <el-input v-model="logistics.freight"></el-input>
                    </el-form-item>
                </el-col>
                <span v-if="logistics.way==0">
                    <el-col :span="8">
                        <el-form-item label="物流公司" prop="logistics">
                            <el-select style="width: 100%;" v-model="logistics.logistics" placeholder="请选择" >
                                <el-option :label="item.name" :value="item.id + ','+ item.name+','+item.code" v-for="item in logisticsList">
                                </el-option>
                                
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="物流单号" prop="logisticsNo">
                            <el-input v-model="logistics.logisticsNo"></el-input>
                        </el-form-item>
                    </el-col>
                </span>
                <span v-if="logistics.way==1">
                    <el-col :span="8">
                        <el-form-item label="司机姓名" prop="driverName">
                            <el-input v-model="logistics.driverName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" prop="driverPid">
                            <el-input v-model="logistics.driverPid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式" prop="driverTel">
                            <el-input v-model="logistics.driverTel"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车牌号" prop="vehicleNo">
                            <el-input v-model="logistics.vehicleNo"></el-input>
                        </el-form-item>
                    </el-col>
                </span>
                <el-col :span="24">
                    <imageUpload :param="imageParam" title="点击上传物流图片" :imageArray='logistics.imageArray' v-on:postUrl="getImgUrl"></imageUpload>
                </el-col>
            </div>
        </el-form>
        <el-button type="primary" class="fr" @click="confirm('logistics')">发货</el-button>
        <div style="clear:both">
        </div>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import dateUtil from '../../common/dateUtil.js'
import imageUpload from '../imageUpload.vue'

export default {

    data() {
        return {
            pickerOptions: { //发货时间不能大于当时
                disabledDate(time) {
                    //return time.getTime() > Date.now();
                    return false;
                }
            },

            logistics: {
                way: 0,
                freightType: 1,
                freight: '',
                logistics: '',
                logisticsNo: '',
                driverName: '',
                driverPid: '',
                driverTel: '',
                vehicleNo: '',
                deliveryTime: '',
                imageArray: []
            },
            imageParam: {
                keyName: 'yaocai'
            },
            rules: {

                logistics: [{
                    required: true,
                    message: '请选择物流公司',
                    trigger: 'blur,change'
                }],
                logisticsNo: [{
                    required: true,
                    message: '请输入物流单号',
                    trigger: 'blur,change'
                }],
                driverName: [{
                    required: true,
                    message: '请填写司机姓名',
                    trigger: 'blur,change'
                }],
                driverPid: [{
                    required: true,
                    message: '请输入身份证号',
                    trigger: 'blur,change'
                }],
                driverTel: [{
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur,change'
                }],
                vehicleNo: [{
                    required: true,
                    message: '请输入车牌号',
                    trigger: 'blur,change'
                }],
                freight: [{
                    required: true,
                    message: '请输入运费金额',
                    trigger: 'blur,change'
                }],
                deliveryTime: [{
                    type: 'date',
                    required: true,
                    message: '请选择日期',
                    trigger: 'blur,change'
                }],
            }
        }

    },
    components: {
        imageUpload
    },
    computed: {
        formData() {
            let obj = this.$store.state.outStorage.outConsigneeInfo;
            obj.address = obj.consigneeProvinceName + obj.consigneeCityName + obj.consigneeDistrictName + obj.consigneeAddress;
            return obj;
        },
        logisticsList() {
            return this.$store.state.common.logisticsList;
        }
    },
    mounted() {
        this.getLogisticsList();
    },
    methods: {
        getImgUrl(url) {
            this.logistics.imageArray.push(url);
        }, 
        //获取物流公司列表
        getLogisticsList() {
            let url = httpService.urlCommon + httpService.apiUrl.most;
            let body = {
                biz_module: 'expressService',
                biz_method: 'queryExpressList',
                biz_param: {

                }
            };
            let obj = {
                body: body,
                path: url
            }
            this.$store.dispatch("com_getLogisticsList", obj).then(() => {
                resolve();
            }, () => {

                reject();
            });
        },
        //确认发货
        confirm(formName) {

            let _self = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let log = _self.logistics;
                    let formData = _self.formData;
                    let param = {
                        id: formData.id,
                        //客户收货地址
                        consignee: formData.consignee,
                        consigneeName: formData.consigneeName,
                        consigneePhone: formData.consigneePhone,
                        consigneeAddress: formData.consigneeAddress,
                        consigneeCountry: 7,
                        consigneeProvince: formData.consigneeProvince,
                        consigneeCity: formData.consigneeCity,
                        consigneeDistrict: formData.consigneeDistrict,
                        //物流信息
                        logisticsMode: log.way,

                        freight: log.freight,
                        freightType: log.freightType,
                    }
                    param.deliveryTime = dateUtil.formatDate(log.deliveryTime);

                    if (log.way == 0) {
                        let logisticsArr = log.logistics.split(",");
                        param.logisticsCompany = logisticsArr[0];
                        param.logisticsCompanyName = logisticsArr[1];
                        param.logisticsCompanyCode = logisticsArr[2];
                        param.logisticsVoucher = log.logisticsNo;

                    } else if (log.way == 1) {
                        param.driverName = log.driverName;
                        param.driverPid = log.driverPid;
                        param.driverTel = log.driverTel;
                        param.vehicleNo = log.vehicleNo;
                    }
                    param.images = log.imageArray.join(",");
                    this.$emit('send', {
                        param:param
                    });
                    let url = httpService.urlCommon + httpService.apiUrl.most;
                    let body = {
                        biz_module: 'wmsStockOutService',
                        biz_method: 'validateDeliveryStockOut',
                        biz_param: param
                    };
                   
                   


                }
            })
        }


    }
}
</script>